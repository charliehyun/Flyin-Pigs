import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';


interface DropdownOption {
  name: string,
  code: string
}

@Component({
  selector: 'app-employees-list',
  templateUrl: './search.component.html'
})

export class SearchComponent implements OnInit {
  classes: DropdownOption[];
  transportType: DropdownOption[];
  selectedClass: DropdownOption = {name: 'Economy', code: 'E'};
  selectedTransport: DropdownOption = {name: 'Car', code: 'C'};

  // listItems: DropdownOption[];

  
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
    // this.listItems = [{name: 'fa fa-user', code: 'v1'}, {name: 'fa fa-user-cog', code: 'v2'}];
   }

   //google autocomplete stuff.
  formattedaddress1= " ";
  formattedaddress2= " ";
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



   handleClear() {
    this.selectedClass = {name: 'Economy', code: 'E'};
    this.selectedTransport = {name: 'Car', code: 'C'};
   }

  ngOnInit(): void {
  }

}