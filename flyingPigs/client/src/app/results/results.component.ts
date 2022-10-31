import { Component, OnDestroy, OnInit } from '@angular/core';
import {filter, first, flatMap, map, Observable, Subject, Subscription, take} from 'rxjs';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { ResultsService} from "../results/results.service";
import { SearchSchema, DropdownOption } from '../searchSchema';
import { Router } from '@angular/router';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { DataService } from "../data.service";
import { FlightSchema, TripSchema } from '../flightSchema';
import {NGXLogger} from "ngx-logger";

@Component({
  selector: 'results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})

export class ResultsComponent implements OnInit, OnDestroy {
  classes: DropdownOption[];  // Flight class options
  selectedClass: DropdownOption = {name: 'Economy', code: 'ECONOMY'}; // Selected flight class
  dTransportType: DropdownOption[]; // Transportation to airport options
  aTransportType: DropdownOption[]; // Transportation from airport options
  selectedDTransport: DropdownOption = {name: 'Car', code: 'driving'}; // Transportation option
  selectedATransport: DropdownOption = {name: 'Car', code: 'driving'}; // Transportation option
  isRoundTrip: boolean = false; // Round Trip toggle
  hours: DropdownOption[]; // hours for transportation before/after flight

  adultPass: number = 1;  // number of adult passengers
  childPass: number = 0;  // number of child passengers
  infantPass: number = 0; // number of infant passengers

  maxTimeStart: DropdownOption = {name: '3 hr', sec: 10800}; //default starting driving hours
  maxTimeEnd: DropdownOption = {name: '1 hr', sec: 3600}; //default end driving hours

  totalPass: number = this.adultPass + this.childPass + this.infantPass;  // total number of passengers
  subscription!: Subscription;
  date: any;
  maxDate: any;
  departDate: string;
  returnDate: string;
  dates: any;
    
  constructor(private resultsService: ResultsService, private data: DataService, private router: Router,
              private fb: FormBuilder, private logger: NGXLogger) {
  // COPY START
    this.classes = [
      {name: 'Economy', code: 'ECONOMY'},
      {name: 'Premium Economy', code: 'PREMIUM_ECONOMY'},
      {name: 'Business', code: 'BUSINESS'},
      {name: 'First', code: 'FIRST'}
    ];
    this.dTransportType = [
      {name: 'Car', code: 'driving'},
      {name: 'Public Transit', code: 'transit'},
      // {name: 'Bike', code: 'Biking'},
      // {name: 'Walk', code: 'Walking'}
    ];
    this.aTransportType = [
      {name: 'Car', code: 'driving'},
      {name: 'Public Transit', code: 'transit'},
      // {name: 'Bike', code: 'Biking'},
      // {name: 'Walk', code: 'Walking'}
    ];
    this.hours = [
      {name: '1 hr', sec: 3600},
      {name: '2 hr', sec: 7200},
      {name: '3 hr', sec: 10800},
      {name: '4 hr', sec: 14400},
      {name: '5 hr', sec: 18000},
      {name: '6 hr', sec: 21600},
      {name: '7 hr', sec: 25200}
    ];
  }

  // Google autocomplete stuff
  departAdd= "";
  arriveAdd= "";
  options:Options = new Options({
    componentRestrictions:{
      country:"US"}
  });
  AddressChange1(address: any) {
    this.departAdd = address.formatted_address;
  }
  AddressChange2(address: any) {
    this.arriveAdd = address.formatted_address;
  }

  // update total passengers display when passenger overlay is exited
  updatePassengers() {
    this.totalPass = this.adultPass + this.childPass + this.infantPass;
  }

  // ensure return date is cleared if one way is selected
  handleOneWay(e) {
    if(e.checked) {
      this.returnDate = ""
    }
  }

  // reset input boxes to valid, clear inputs, set back to default, and set search object back to default
  handleClear() {
    sessionStorage.removeItem('searchParams');
    this.resetValidity();
    this.selectedClass = {name: 'Economy', code: 'ECONOMY'};
    this.selectedDTransport = {name: 'Car', code: 'driving'};
    this.selectedATransport = {name: 'Car', code: 'driving'};
    this.isRoundTrip = false;
    this.adultPass = 1;
    this.childPass = 0;
    this.infantPass = 0;
    this.departDate = "";
    this.returnDate = "";
    this.totalPass = this.adultPass + this.childPass + this.infantPass;
    this.departAdd = "";
    this.arriveAdd = "";
    this.maxTimeStart = {name: '3 hr', sec: 10800};
    this.maxTimeEnd = {name: '1 hr', sec: 3600};
  }

  search: SearchSchema = {
    selectedClass: {name: 'Economy', code: 'ECONOMY'},
    isRoundTrip: false,
    adultPass: 1,
    childPass: 0,
    infantPass: 0,
    totalPass: 0,
    departDate: "",
    returnDate: "",
    departAdd: "",
    departCoord: new google.maps.LatLng({"lat": 0, "lng": 0}),
    arriveAdd: "",
    arriveCoord: new google.maps.LatLng({"lat": 0, "lng": 0}),
    selectedDTransport: {name: 'Car', code: 'driving'},
    selectedATransport: {name: 'Car', code: 'driving'},
    maxTimeStart: {name: '3 hr', sec: 10800},
    maxTimeEnd: {name: '1 hr', sec: 3600}
  }

  // input validation, geocoding, search sent to results, and navigate to results
  async handleSearch() {
    this.resetValidity();

    let departureCoord;
    let arrivalCoord
    let prevSearch = JSON.parse(sessionStorage.getItem('searchParams') || "");
    if(!prevSearch || prevSearch.departAdd != this.departAdd){
      departureCoord = await this.geocode(this.departAdd);
    }
    else {
      departureCoord = prevSearch.departCoord;
    }
    if(!prevSearch || prevSearch.arriveAdd != this.arriveAdd){
      arrivalCoord = await this.geocode(this.arriveAdd);
    }
    else {
      arrivalCoord = prevSearch.arriveCoord;
    }

    let route = true;
    // input validation
    if(!this.departDate) {
      const x = document.getElementById('departDate');
      x?.classList.add('ng-invalid')
      x?.classList.add('ng-dirty')
      route = false
    } 
    else {
      const x = document.getElementById('departDate');
      var departDateObj = new Date(this.departDate);
      if(departDateObj < new Date(this.date) || departDateObj > new Date(this.maxDate) || x?.classList.contains('ng-invalid')) {
        x?.classList.add('ng-invalid')
        x?.classList.add('ng-dirty')
        route = false
      }
    }
    if(!this.returnDate) {
      if(this.isRoundTrip) {
        const x = document.getElementById('returnDate');
        x?.classList.add('ng-invalid')
        x?.classList.add('ng-dirty')
        route = false
      }
    }
    else {
      const x = document.getElementById('returnDate');
      var returnDateObj = new Date(this.returnDate);
      if(returnDateObj < new Date(this.departDate) || returnDateObj > new Date(this.maxDate) || x?.classList.contains('ng-invalid')) {
        x?.classList.add('ng-invalid')
        x?.classList.add('ng-dirty')
        route = false
      }
    }
    if(!this.departAdd || departureCoord == null) {
      // departure address is invalid probably
      // should not advance
      const x = document.getElementById('daddress');
      x?.classList.add('ng-invalid')
      x?.classList.add('ng-dirty')
      route = false
    }
    if(!this.arriveAdd || arrivalCoord == null) {
      // arrival address is invalid probably
      // should not advance
      const x = document.getElementById('aaddress');
      x?.classList.add('ng-invalid')
      x?.classList.add('ng-dirty')
      route = false
    }

    // if valid, create search object and route to results
    // else, alert
    if(route) {
      this.search = {
        selectedClass: this.selectedClass,
        isRoundTrip: this.isRoundTrip,
        adultPass: this.adultPass,
        childPass: this.childPass,
        infantPass: this.infantPass,
        totalPass: this.totalPass,
        departDate: this.departDate,
        returnDate: this.returnDate,
        departAdd: this.departAdd,
        departCoord: departureCoord,
        arriveAdd: this.arriveAdd,
        arriveCoord: arrivalCoord,
        selectedDTransport: this.selectedDTransport,
        selectedATransport: this.selectedATransport,
        maxTimeStart: this.maxTimeStart,
        maxTimeEnd: this.maxTimeEnd
      }
      sessionStorage.setItem('searchParams', JSON.stringify(this.search));
      this.data.changeMessage(this.search)
      this.router.navigate(['results'])
    } else {
      alert("Error: Some fields are invalid or empty. Please fix them and try again.")
    }
  }

  resetValidity() {
    const elements: Element[] = Array.from(document.getElementsByTagName("input"));
    elements.forEach((el: Element) => {
      el.classList.remove('ng-invalid')
      el.classList.remove('ng-dirty')
      el.classList.add('ng-pristine')
    })
  }

  /*
  Geocodes an address.
  Returns LatLng object with lat() and lng() getter functions
  If an error occurs, returns a null. 
  */
  async geocode(address) {
    // this.logger.info("GEOCODING");
    console.log("GEOCODING");
    var coord;
    var geocoder = new google.maps.Geocoder();
    await geocoder.geocode({ 'address': address}).then(response => {
      coord = response.results[0].geometry.location;
      // console.log(response);
    }).catch(e => {
      coord = null;
      // console.log(e);
    });
    return coord;
  }
  // COPY END
  // DIFFERENT FROM SEARCH
  results$: Observable<TripSchema[]> = new Observable();
  resultsSubscription:Subscription;
  filteredResults$:Subject<TripSchema[]> = new Subject();
  ngOnInit(): void {
    this.subscription = this.data.currentMessage.subscribe(search => this.search = search)

    this.search = JSON.parse(sessionStorage.getItem('searchParams') || "");
    this.selectedClass = this.search.selectedClass;
    this.isRoundTrip = this.search.isRoundTrip;
    this.adultPass = this.search.adultPass;
    this.childPass = this.search.childPass;
    this.infantPass = this.search.infantPass;
    this.totalPass = this.search.totalPass;
    this.departDate = this.search.departDate;
    this.returnDate = this.search.returnDate;
    this.departAdd = this.search.departAdd;
    this.arriveAdd = this.search.arriveAdd;
    this.selectedDTransport = this.search.selectedDTransport;
    this.selectedATransport = this.search.selectedATransport;
    this.maxTimeStart = this.search.maxTimeStart;
    this.maxTimeEnd = this.search.maxTimeEnd;

    this.results$ = this.resultsService.searchAirports(this.search);

    this.results$.subscribe(value => {
      this.filteredResults$.next(value);
      // for (let i = 0; i < value.length; i++) {
      //   for (let j = 0; j < value[i].length; j++) {
      //     value[i][j].departureTime = value[i][j].departureTime.toString()
      //     value[i][j].arrivalTime = value[i][j].arrivalTime.toString()
          
          // parse price to 2 decimals
          // Math.round(value[i][j].price * 100) / 100
      //   }
      // }
    });
    //this.filterResults()
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  filterResults() {

    // this.resultsSubscription.unsubscribe();
    // this.results$.pipe(map(flights =>
    //   flights.filter(flight => flight[0].price < 200)))
    //     .subscribe(value => this.filteredResults$.next(value));

  }

}