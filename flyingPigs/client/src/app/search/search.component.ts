import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';


interface DropdownOption {
  name: string,
  code: string
}

@Component({
  selector: 'app-employees-list',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {
  classes: DropdownOption[];  // Flight class options
  selectedClass: DropdownOption = {name: 'Economy', code: 'E'}; // Selected flight class
  transportType: DropdownOption[];  // Transportation to airport options
  selectedTransport: DropdownOption = {name: 'Car', code: 'C'}; // Transportation option

  adultPass: number = 1;
  childPass: number = 0;
  infantPass: number = 0;
  totalPass: number = this.adultPass + this.childPass + this.infantPass;
  
  constructor() {
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

  }

  updatePassengers() {
    this.totalPass = this.adultPass + this.childPass + this.infantPass;
  }

  handleClear() {
    this.selectedClass = {name: 'Economy', code: 'E'};
    this.selectedTransport = {name: 'Car', code: 'C'};
    this.adultPass = 1;
    this.childPass = 0;
    this.infantPass = 0;
    this.totalPass = this.adultPass + this.childPass + this.infantPass;
  }

  ngOnInit(): void {
  }

}