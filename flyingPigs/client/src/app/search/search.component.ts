import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { SearchSchema, DropdownOption } from '../searchSchema';
import { Router } from '@angular/router';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { DataService } from "../data.service";
import {FlightSchema} from "../flightSchema";
import {Message} from 'primeng/api';
import {NGXLogger} from "ngx-logger";
import { faCar, faBus, faPlane, faPersonBiking, faPersonWalking, faDollarSign, faClock, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit, OnDestroy {
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
  subscription!: Subscription;  // subscription to send search from search to results
  date: any;
  maxDate: any;
  departDate: string;
  returnDate: string;
  dates: any;

  //icons
  faCar = faCar;
  faBus = faBus;

  constructor(private data: DataService, private router: Router, private fb: FormBuilder, private logger: NGXLogger) {
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
    let departureCoord = await this.geocode(this.departAdd);
    let arrivalCoord = await this.geocode(this.arriveAdd);

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

  // DIFFERENT FROM RESULTS
  ngOnInit() {
    // this.search = JSON.parse(sessionStorage.getItem('searchParams') || "");
    // if(this.search) {
    //   this.selectedClass = this.search.selectedClass;
    //   this.isRoundTrip = this.search.isRoundTrip;
    //   this.adultPass = this.search.adultPass;
    //   this.childPass = this.search.childPass;
    //   this.infantPass = this.search.infantPass;
    //   this.totalPass = this.search.totalPass;
    //   this.departDate = this.search.departDate;
    //   this.returnDate = this.search.returnDate;
    //   this.departAdd = this.search.departAdd;
    //   this.arriveAdd = this.search.arriveAdd;
    //   this.selectedDTransport = this.search.selectedDTransport;
    //   this.selectedATransport = this.search.selectedATransport;
    //   this.maxTimeStart = this.search.maxTimeStart;
    //   this.maxTimeEnd = this.search.maxTimeEnd;
    // }
    this.subscription = this.data.currentMessage.subscribe(search => this.search = search)
    this.date = new Date().toISOString().split("T")[0];
    this.maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString().split("T")[0];
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}