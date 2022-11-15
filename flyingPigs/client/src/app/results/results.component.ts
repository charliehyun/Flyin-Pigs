import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {filter, first, flatMap, map, Observable, Subject, Subscription, take, tap} from 'rxjs';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { ResultsService} from "../results/results.service";
import { SearchSchema, DropdownOption } from '../searchSchema';
import { Router } from '@angular/router';
import { ResultInfoSchema, TripSchema } from '../flightSchema';
import {NGXLogger} from "ngx-logger";
import { MenuItem } from 'primeng/api';
import { faCar, faBus, faPlane, faPersonBiking, faPersonWalking, faDollarSign, faClock, faUser } from '@fortawesome/free-solid-svg-icons';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import { Time } from '@angular/common';

@Component({
  selector: 'results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})

export class ResultsComponent implements OnInit {
  // SEARCH VARS
  search: SearchSchema;
  selectedDTransport: DropdownOption = {name: 'Car', code: 'driving', icon: 'car'}; // Transportation option
  selectedATransport: DropdownOption = {name: 'Car', code: 'driving', icon: 'car'}; // Transportation option

  // FILTER VARS
  totalPrice: number[] = [];
  stops: any[];
  selectedStop: any = null;
  filterAirlines: string[];
  selectedAirlines: any[];
  filterDepartAirports: any[];
  selectedDepartAirports: any[];
  filterArrivalAirports: string[];
  selectedArrivalAirports: any[];
  maxTravelTime: number = 24;
  maxFlightTime: number = 10;
  departTimeStart: string;
  departTimeEnd: string;
  arrivalTimeStart: string;
  arrivalTimeEnd: string;
  minPrice: number;
  maxPrice: number;

  airports: any[];
  airlineTags: string[] = ['AA', 'AS', 'B6', 'DL', 'F9', 'HA', 'NK', 'UA', 'WN'];

  // RESULTS VARS
  results$: Observable<ResultInfoSchema> = new Observable();  // original results returned from backend
  trips:TripSchema[]; // original results returned from backend but not async:)
  filteredTrips:TripSchema[]; // filtered results
  displayTrips:TripSchema[];  // results that are displayed on frontend (splice of filteredTrips)
  loaded: number = 10;  // number of results to show
  shouldLoad:boolean = false; // if it is possible to load more
   
  constructor(private resultsService: ResultsService, private logger: NGXLogger, library: FaIconLibrary, private router: Router) {
    this.stops = [
      {name: 'Any number of stops', key: 'all'},
      {name: 'Nonstop only', key: 'none'},
      {name: '1 stop or fewer', key: 'one'},
      {name: '2 stops or fewer', key: 'two'}
    ];

    library.addIcons(
      faCar,
      faBus
    );

    this.selectedStop = this.stops[0];

    this.departTimeStart = "00:00";
    this.departTimeEnd = "23:59";

    this.arrivalTimeStart = "00:00";
    this.arrivalTimeEnd = "23:59";

  }

  // reset validity of all input boxes
  resetValidity() {
    const elements: Element[] = Array.from(document.getElementsByTagName("input"));
    elements.forEach((el: Element) => {
      el.classList.remove('ng-invalid')
      el.classList.remove('ng-dirty')
      el.classList.add('ng-pristine')
    })
  }

  setDefaults() {
    this.search = {
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
        selectedDTransport: {name: 'Car', code: 'driving', icon: 'car'},
        selectedATransport: {name: 'Car', code: 'driving', icon: 'car'},
        maxTimeStart: {name: '3 hr', sec: 10800},
        maxTimeEnd: {name: '1 hr', sec: 3600}
    }
    return JSON.stringify(this.search);
  }

  ngOnInit(): void {
    // grab search info from search page and assign to input vars
    console.log("NEW RESULTS")
    this.search = JSON.parse(sessionStorage.getItem('searchParams') || this.setDefaults());
    this.selectedDTransport = this.search.selectedDTransport;
    this.selectedATransport = this.search.selectedATransport;

    // get trip results
    this.results$ = this.resultsService.searchAirports(this.search);
    this.results$.subscribe(value => {
      this.trips = value.trips;
      this.filteredTrips = value.trips;
      this.displayTrips = value.trips.slice(0,this.loaded);
      if(this.filteredTrips.length > this.loaded) {
        this.shouldLoad = true;
      }
      this.filterDepartAirports = value.depAirports;
      this.filterArrivalAirports = value.arrAirports;
      this.selectedArrivalAirports = this.filterArrivalAirports;
      this.selectedDepartAirports = this.filterDepartAirports;
      this.filterAirlines = value.airlines;
      this.airlineNames();
      this.maxPrice = value.maxPrice || 0;
      this.minPrice = value.minPrice || 0;
      this.totalPrice = [this.minPrice, this.maxPrice];
      this.selectedAirlines = this.filterAirlines;
    });
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

  filterResults() {
    let newTripArr:TripSchema[] = [];
    let chosenStops:number;
    this.logger.info("Filtering data...");
    //converted selected stops into a number
    switch(this.selectedStop.key) {
      case("none"): chosenStops = 0;
      break;
      case("all"): chosenStops = Number.MAX_SAFE_INTEGER;
      break;
      case("one"): chosenStops = 1;
      break;
      case("two"): chosenStops = 2;
      break;
    }

    this.trips.forEach(trip => {
      //get total trip time
      let totalTripTime:number = trip.totalDepTime
      if (trip.totalRetTime) {
        totalTripTime += trip.totalRetTime;
      }
      //get total flight time
      let totalFlightTime:number = trip.departingFlight.flightTime;
      if (trip.returningFlight) {
        totalFlightTime += trip.returningFlight.flightTime;
      }

      //convert string to Time to object
      let departTimeStrings = trip.departingFlight.departureTime.split("T").slice(-1)[0].split(":");
      let departTimeString = departTimeStrings[0] + ":" +  departTimeStrings[1];
      let arriveTimeStrings = trip.departingFlight.arrivalTime.split("T").slice(-1)[0].split(":");
      let arriveTimeString = arriveTimeStrings[0] + ":" + arriveTimeStrings[1];


      //determine what airlines are available.
      let includedAirlines = trip.departingFlight.airlines.every(airline => this.selectedAirlines.includes(airline));

      //set airline name from code(?)

      if (trip.departingFlight.numberOfStops <= chosenStops &&
          trip.flightPrice <= this.totalPrice[1] &&
          trip.flightPrice >= this.totalPrice[0] &&
          totalTripTime <= (this.maxTravelTime * 3600) &&
          totalFlightTime <= (this.maxFlightTime * 3600) &&
          departTimeString >= this.departTimeStart &&
          departTimeString <= this.departTimeEnd &&
          arriveTimeString >= this.arrivalTimeStart &&
          arriveTimeString <= this.arrivalTimeEnd &&
          this.selectedDepartAirports.includes(trip.departingFlight.departureAirport) &&
          this.selectedArrivalAirports.includes(trip.departingFlight.arrivalAirport) &&
          includedAirlines
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
  }

  //setting airline names from code (need to redo)
  airlineNames() {
    if (this.filterAirlines.length == 1) {
      if (this.filterAirlines[0] == "AA") {
        this.filterAirlines[0] = "American";
      } else if (this.filterAirlines[0] == "AS") {
        this.filterAirlines[0] = "Alaska";
      } else if (this.filterAirlines[0] == "B6") {
        this.filterAirlines[0] = "JetBlue";
      } else if (this.filterAirlines[0] == "DL") {
        this.filterAirlines[0] = "Delta";
      } else if (this.filterAirlines[0] == "F9") {
        this.filterAirlines[0] = "Frontier";
      } else if (this.filterAirlines[0] == "HA") {
        this.filterAirlines[0] = "Hawaiian";
      } else if (this.filterAirlines[0] == "NK") {
        this.filterAirlines[0] = "Spirit";
      } else if (this.filterAirlines[0] == "UA") {
        this.filterAirlines[0] = "United";
      } else if (this.filterAirlines[0] == "WN") {
        this.filterAirlines[0] = "Southwest";
      }
    }
  }

  resetFilter() {
    this.logger.info("Resetting filter");

    this.filteredTrips = this.trips;
    this.displayTrips = this.filteredTrips.slice(0,this.loaded);
    if(this.filteredTrips.length > this.loaded) {
      this.shouldLoad = true;
    } else {
      this.shouldLoad = false;
    }
  }

}