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
    emailNotifications: boolean = false;
    savedTrips: any[];
    cols: any[];
    savedTrip: any;
  
    constructor( private router: Router) {
  
    }

    ngOnInit() {
      //this.productService.getProductsSmall().then(data => this.products = data);

      this.cols = [
          { field: 'ddate', header: 'Departure Date' },
          { field: 'daddress', header: 'Departure Address' },
          { field: 'adate', header: 'Arrival Date' },
          { field: 'aaddress', header: 'Arrival Address' },
          { field: 'cheapPrice', header: 'Cheapest Price' },
          { field: 'removeSearch', header: 'Remove Search' },
      ];
  }
  }