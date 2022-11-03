import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {filter, first, flatMap, map, Observable, Subject, Subscription, take, tap} from 'rxjs';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { ResultsService} from "../results/results.service";
import { SearchSchema, DropdownOption } from '../searchSchema';
import { Router } from '@angular/router';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { DataService } from "../data.service";
import {ScrollTopModule} from 'primeng/scrolltop';
import { FlightSchema, ResultInfoSchema, TripSchema } from '../flightSchema';
import {NGXLogger} from "ngx-logger";
import {ToolbarModule} from 'primeng/toolbar';
import { MenuItem } from 'primeng/api';
import {InputTextModule} from 'primeng/inputtext';
import {SliderModule} from 'primeng/slider';
import { Time } from '@angular/common';
import {RadioButtonModule} from 'primeng/radiobutton';


@Component({
  selector: 'results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  // encapsulation: ViewEncapsulation.None
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
  selectedStops: DropdownOption = {name: '1', code: '1'};
  numStops: DropdownOption[];

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

  selectedStop: any = null;

  stops: any[] = [{name: 'Any number of stops', key: 'all'}, {name: 'Nonstop only', key: 'none'}, {name: '1 stop or fewer', key: 'one'}, {name: '2 stops or fewer', key: 'two'}];
  totalPrice: number[] = [1,10000];
  filterAirlines: any[];
  selectedAirlines: any[];
  filterDepartAirports: any[];
  selectedDepartAirports: any[];
  filterArrivalAirports: string[];
  selectedArrivalAirports: any[];
  maxTravelTime: number = 24;
  maxFlightTime: number = 10;
  departTime: Time;
  arrivalTime: Time;

  airports: any[];
 

  items: MenuItem[];

   
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
    // this.numStops = [
    //   {name: '0', code: '0'},
    //   {name: '1', code: '1'},
    //   {name: '2', code: '2'},
    //   {name: '3', code: '3'}
    // ];
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
    this.selectedStops = {name: '0', code: '0'};
  }

  search: SearchSchema = {
    selectedClass: {name: 'Economy', code: 'ECONOMY'},
    isRoundTrip: false,
    adultPass: 1,
    childPass: 0,
    infantPass: 0,
    totalPass: 1,
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
    // this.results$ = this.resultsService.clearAirports();
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
      // this.router.navigate(['results'])
      this.ngOnInit();
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
  results$: Observable<ResultInfoSchema> = new Observable();
  trips:TripSchema[];
  filteredTrips:TripSchema[];
  displayTrips:TripSchema[];
  loaded: number = 10;
  shouldLoad:boolean = false;
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
      this.trips = value.trips;
      this.filteredTrips = value.trips;
      this.displayTrips = value.trips.slice(0,this.loaded);
      if(this.filteredTrips.length > this.loaded) {
        this.shouldLoad = true;
      }
      this.filterDepartAirports = value.depAirlines; //need to change names later
      this.filterArrivalAirports = value.arrAirlines; //need to change names later
      this.selectedArrivalAirports = this.filterArrivalAirports;
      this.selectedDepartAirports = this.filterDepartAirports;
      this.filterAirlines = value.airlines;
    });

    this.selectedStop = this.stops[1];
    

  }

  loadMore() {
    this.loaded += 10
    this.displayTrips = this.filteredTrips.slice(0,this.loaded);
    if(this.filteredTrips.length > this.loaded) {
      this.shouldLoad = true;
    } else {
      this.shouldLoad = false;
    }
  }

  updateDuration() {
    this.maxFlightTime = this.maxFlightTime;
    this.maxTravelTime = this.maxTravelTime;
  }

  updateTotalPrice() {
    this.totalPrice = this.totalPrice;
  }

  updateStops() {
    this.stops = this.stops;
  }

  updateTravelTimes() {
    this.departTime = this.departTime;
    this.arrivalTime = this.arrivalTime;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  filterResults() {
    let newTripArr:TripSchema[] = [];
    let chosenStops:number;

    this.logger.info("Filtering data...");
    //converted selected stops into a number
    switch(this.selectedStop)
    {
      case("none"): chosenStops = 0;
      break;
      case("all"): chosenStops = Number.MAX_SAFE_INTEGER;
      break;
      case("one"): chosenStops = 1;
      break;
      case("two"): chosenStops = 2;
      break;
    }


    this.trips.forEach(trip =>
    {
      //get total trip time
      let totalTripTime:number = trip.totalDepTime
      if (trip.totalRetTime)
      {
        totalTripTime += trip.totalRetTime;
      }
      //get total flight time
      let totalFlightTime:number = trip.departingFlight.flightTime;
      if (trip.returningFlight)
      {
        totalFlightTime += trip.returningFlight.flightTime;
      }

      //convert string to Time to object
      //convert string to Time to object of time
      let departTimeStrings = trip.departingFlight.departureTime.split("T").slice(-1)[0].split(":");
      let departTimeString = departTimeStrings[0] + ":" +  departTimeStrings[1];
      let arriveTimeStrings = trip.departingFlight.arrivalTime.split("T").slice(-1)[0].split(":");
      let arriveTimeString = arriveTimeStrings[0] + ":" + arriveTimeStrings[1];

      let userDepartTime:string;
      let userArriveTime:string;
      this.departTime ? userDepartTime = this.departTime.toString() : userDepartTime = "23:59";
      this.arrivalTime ? userArriveTime = this.arrivalTime.toString() : userArriveTime = "23:59";
      if (trip.departingFlight.numberOfStops <= chosenStops &&
          trip.flightPrice <= this.totalPrice[1] &&
          trip.flightPrice >= this.totalPrice[0] &&
          totalTripTime <= (this.maxTravelTime * 3600) &&
          totalFlightTime <= (this.maxFlightTime * 3600) &&
          departTimeString <= userDepartTime &&
          arriveTimeString <= userArriveTime
          )
      {
        newTripArr.push(trip);
      }
    });
    this.filteredTrips = newTripArr;
    this.loaded = 10;
    this.displayTrips = this.filteredTrips.slice(0,this.loaded);
    if(this.filteredTrips.length > this.loaded) {
      this.shouldLoad = true;
    } else {
      this.shouldLoad = false;
    }
    this.logger.info("Filtering data...");
  }

  resetFilter() {
    this.logger.info("Resetting filter");
    this.filteredTrips = this.trips;
  }

}