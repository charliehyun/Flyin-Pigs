import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';


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

   handleClear() {
    this.selectedClass = {name: 'Economy', code: 'E'};
    this.selectedTransport = {name: 'Car', code: 'C'};
   }

  ngOnInit(): void {
  }

}