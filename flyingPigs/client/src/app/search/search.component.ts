import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { SearchService} from "./search.service";
import {AirportSchema} from "../airportSchema";
import { SearchSchema, DropdownOption } from '../searchSchema';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { DataService } from "../data.service";

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit, OnDestroy {
  classes: DropdownOption[];  // Flight class options
  selectedClass: DropdownOption = {name: 'Economy', code: 'E'}; // Selected flight class
  transportType: DropdownOption[];  // Transportation to airport options
  selectedTransport: DropdownOption = {name: 'Car', code: 'Driving'}; // Transportation option
  filteredAirports$: Observable<AirportSchema[]> = new Observable();
  isRoundTrip: boolean = false; // Round Trip toggle
  hours: DropdownOption[]; // hours for transportation before/after flight

  adultPass: number = 1;  // number of adult passengers
  childPass: number = 0;  // number of child passengers
  infantPass: number = 0; // number of infant passengers

  drivingStartHours: DropdownOption = {name: '3 hr', code: '3 hr'}; //default starting driving hours
  drivingEndHours: DropdownOption = {name: '1 hr', code: '1 hr'}; //default end driving hours

  totalPass: number = this.adultPass + this.childPass + this.infantPass;  // total number of passengers

  message!: string;
  subscription!: Subscription;
  date: any;
  ddate!: string;
  adate!: string;
  dates: any;
  daddress!: string;
  aaddress!: string;
  


  
  constructor(private searchService: SearchService, private data: DataService, private fb: FormBuilder) {
    this.classes = [
      {name: 'Economy', code: 'E'},
      {name: 'Premium Economy', code: 'P'},
      {name: 'Business', code: 'B'},
      {name: 'First', code: 'F'}
    ];
    this.transportType = [
      {name: 'Car', code: 'Driving'},
      {name: 'Public Transit', code: 'Public Transit'},
      {name: 'Bike', code: 'Biking'},
      {name: 'Walk', code: 'Walking'}
    ];
    this.hours = [
      {name: '1 hr', code: '1 hr'},
      {name: '2 hr', code: '2 hr'},
      {name: '3 hr', code: '3 hr'},
      {name: '4 hr', code: '4 hr'},
      {name: '5 hr', code: '5 hr'},
      {name: '6 hr', code: '6 hr'},
      {name: '7 hr', code: '7 hr'}
    ];
    this.createForm();
  }

  //google autocomplete stuff.
  formattedaddress1= "";
  formattedaddress2= "";
  options:Options = new Options({
    componentRestrictions:{
      country:"US"}
  });
  AddressChange1(address: any) {
    this.formattedaddress1 = address.formatted_address;
  }
  AddressChange2(address: any) {
    this.formattedaddress2 = address.formatted_address;
  }
  //backend calls

  FilterAirports() {
    this.filteredAirports$ = this.searchService.filterAirports();
  }

  updatePassengers() {
    this.totalPass = this.adultPass + this.childPass + this.infantPass;
  }

  handleClear() {
    this.selectedClass = {name: 'Economy', code: 'E'};
    this.selectedTransport = {name: 'Car', code: 'Driving'};
    this.isRoundTrip = false;
    this.adultPass = 1;
    this.childPass = 0;
    this.infantPass = 0;
    this.totalPass = this.adultPass + this.childPass + this.infantPass;
    this.formattedaddress1= "";
    this.formattedaddress2= "";
  }

  ngOnInit() {
    this.subscription = this.data.currentMessage.subscribe(message => this.message = message);
    this.date = new Date().toISOString().slice(0, 10);
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  newMessage() {
    this.data.changeMessage(this.message)
  }

  createForm() {
    this.dates = this.fb.group({
       ddate: ['', Validators.required ]
    });
  }
}