import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { SearchService} from "./search.service";
import {AirportSchema} from "../airportSchema";

interface DropdownOption {
  name: string,
  code: string
}

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {
  classes: DropdownOption[];  // Flight class options
  selectedClass: DropdownOption = {name: 'Economy', code: 'E'}; // Selected flight class
  transportType: DropdownOption[];  // Transportation to airport options
  selectedTransport: DropdownOption = {name: 'Car', code: 'C'}; // Transportation option
  filteredAirports$: Observable<AirportSchema[]> = new Observable();
  isRoundTrip: boolean = false; // Round Trip toggle

  adultPass: number = 1;  // number of adult passengers
  childPass: number = 0;  // number of child passengers
  infantPass: number = 0; // number of infant passengers
  totalPass: number = this.adultPass + this.childPass + this.infantPass;

  drivingStartHours = 3;
  drivingEndHours = 1;
  
  constructor(private searchService: SearchService) {
    this.classes = [
      {name: 'Economy', code: 'E'},
      {name: 'Premium Economy', code: 'P'},
      {name: 'Business', code: 'B'},
      {name: 'First', code: 'F'}
    ];
    this.transportType = [
      {name: 'Car', code: 'C'},
      {name: 'Public Transit', code: 'P'},
      {name: 'Bike', code: 'B'},
      {name: 'Walk', code: 'W'}
    ];
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
    this.selectedTransport = {name: 'Car', code: 'C'};
    this.isRoundTrip = false;
    this.adultPass = 1;
    this.childPass = 0;
    this.infantPass = 0;
    this.totalPass = this.adultPass + this.childPass + this.infantPass;
    this.formattedaddress1= "";
    this.formattedaddress2= "";
  }

  ngOnInit(): void {
  }

}