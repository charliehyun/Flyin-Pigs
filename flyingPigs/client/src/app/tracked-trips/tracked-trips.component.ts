import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'tracked-trips',
    templateUrl: './tracked-trips.component.html',
    styleUrls: ['./tracked-trips.component.scss']
  })
  
  export class TrackedTripsComponent {
    email: string;
    comments: string;
  
    constructor( private router: Router) {
  
    }
  }