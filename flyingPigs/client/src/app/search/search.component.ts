import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { SearchService } from "./search.service";
import { AirportSchema } from "../airportSchema";
import { SearchSchema, DropdownOption } from '../searchSchema';
import { Router } from '@angular/router';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { DataService } from "../data.service";
import {FlightSchema} from "../flightSchema";
// import {Client} from "@googlemaps/google-maps-services-js";

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit, OnDestroy {
  // COPY START
  classes: DropdownOption[];  // Flight class options
  selectedClass: DropdownOption = {name: 'Economy', code: 'E'}; // Selected flight class
  transportType: DropdownOption[];  // Transportation to airport options
  selectedTransport: DropdownOption = {name: 'Car', code: 'Driving'}; // Transportation option
  results$: Observable<FlightSchema[][]> = new Observable();
  isRoundTrip: boolean = false; // Round Trip toggle
  hours: DropdownOption[]; // hours for transportation before/after flight

  adultPass: number = 1;  // number of adult passengers
  childPass: number = 0;  // number of child passengers
  infantPass: number = 0; // number of infant passengers

  maxTimeStart: DropdownOption = {name: '3 hr', code: '3 hr'}; //default starting driving hours
  maxTimeEnd: DropdownOption = {name: '1 hr', code: '1 hr'}; //default end driving hours

  totalPass: number = this.adultPass + this.childPass + this.infantPass;  // total number of passengers
  subscription!: Subscription;
  date: any;
  maxDate: any;
  departDate: string;
  returnDate: string;
  dates: any;
    
  constructor(private searchService: SearchService, private data: DataService, private router: Router, private fb: FormBuilder) {
    this.classes = [
      {name: 'Economy', code: 'E'},
      {name: 'Premium Economy', code: 'P'},
      {name: 'Business', code: 'B'},
      {name: 'First', code: 'F'}
    ];
    this.transportType = [
      {name: 'Car', code: 'Driving'},
      {name: 'Public Transit', code: 'Public Transit'},
      // {name: 'Bike', code: 'Biking'},
      // {name: 'Walk', code: 'Walking'}
    ];
    this.hours = [
      {name: '1 hr', code: '3600'},
      {name: '2 hr', code: '7200'},
      {name: '3 hr', code: '10800'},
      {name: '4 hr', code: '14400'},
      {name: '5 hr', code: '18000'},
      {name: '6 hr', code: '21600'},
      {name: '7 hr', code: '25200'}
    ];
    this.createForm();
  }

  //google autocomplete stuff.
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
  //backend calls

  updatePassengers() {
    this.totalPass = this.adultPass + this.childPass + this.infantPass;
  }

  handleOneWay(e) {
    if(e.checked) {
      this.returnDate = ""
    }
  }

  handleClear() {
    this.selectedClass = {name: 'Economy', code: 'E'};
    this.selectedTransport = {name: 'Car', code: 'Driving'};
    this.isRoundTrip = false;
    this.adultPass = 1;
    this.childPass = 0;
    this.infantPass = 0;
    this.departDate = "";
    this.returnDate = "";
    this.totalPass = this.adultPass + this.childPass + this.infantPass;
    this.departAdd = "";
    this.arriveAdd = "";
    this.maxTimeStart = {name: '3 hr', code: '3 hr'};
    this.maxTimeEnd = {name: '1 hr', code: '1 hr'};
  }

  search: SearchSchema = {
    selectedClass: {name: 'Economy', code: 'E'},
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
    selectedTransport: {name: 'Car', code: 'Driving'},
    maxTimeStart: {name: '3 hr', code: '3 hr'},
    maxTimeEnd: {name: '1 hr', code: '1 hr'}
  }

  async handleSearch() {
    let departureCoord = await this.geocode(this.departAdd);
    let arrivalCoord = await this.geocode(this.arriveAdd);

    let route = true;
    if(!this.departDate) {
      const x = document.getElementById('departDate');
      x?.classList.add('ng-invalid')
      x?.classList.add('ng-dirty')
      route = false
    } 
    else {      
      // var departDateObj = new Date(this.departDate);
      // var year = departDateObj.getFullYear();
      // var month = departDateObj.getMonth();
      // var day   = departDateObj.getDate();
      // if(departDateObj < this.date || departDateObj > this.maxDate || this.daysInMonth(month, year) > day) {
      //   const x = document.getElementById('departDate');
      //   x?.classList.add('ng-invalid')
      //   x?.classList.add('ng-dirty')
      //   route = false
      // }
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
      if(returnDateObj < new Date(this.date) || returnDateObj > new Date(this.maxDate) || x?.classList.contains('ng-invalid')) {
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
        selectedTransport: this.selectedTransport,
        maxTimeStart: this.maxTimeStart,
        maxTimeEnd: this.maxTimeEnd
      }
      this.results$ = this.searchService.searchAirports(this.search);
      this.data.changeMessage(this.search)
      // this.router.navigate(['results'])
    } else {
      alert("invalid")
    }
  }
  // daysInMonth(month, year) {
  //   let dayNum = -1;
  //   if (['January', 'March', 'May', 'July', 'August', 'October', 'December'].includes(month)) {
  //     dayNum = 31;
  //   } else if (['April', 'June', 'September', 'November'].includes(month)) {
  //     dayNum = 30;
  //   } else {
  //     // If month is February, calculate whether it is a leap year or not
  //     const isLeap = new Date(year, 2, 29).getMonth() === 1;
  //     dayNum = isLeap ? 29 : 28;
  //   }
  //   return dayNum;
  // }
  /*
  Geocodes an address.
  Returns LatLng object with lat() and lng() getter functions
  If an error occurs, returns a null. 
  */
  async geocode(address) {
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
    
  createForm() {
    this.dates = this.fb.group({
        departDate: ['', Validators.required ]
    });
  }
  // COPY END

  // DIFFERENT FROM RESULTS
  ngOnInit() {
    this.subscription = this.data.currentMessage.subscribe(search => this.search = search)
    this.date = new Date().toISOString().split("T")[0];
    this.maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString().split("T")[0];
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}