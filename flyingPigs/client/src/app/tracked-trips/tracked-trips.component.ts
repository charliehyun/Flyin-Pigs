import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService, UserDetails } from '../login-signup/authentication.service';
import {NGXLogger} from "ngx-logger";
import { SearchSchema } from '../searchSchema';
import { TrackedTripsService} from "./tracked-trips.service";
import {Observable} from "rxjs";
import {ResultInfoSchema} from "../flightSchema";

@Component({
    selector: 'tracked-trips',
    templateUrl: './tracked-trips.component.html',
    styleUrls: ['./tracked-trips.component.scss']
  })
  
  export class TrackedTripsComponent {
    email: string;
    comments: string;
    emailNotifications: boolean = false;
    cols: any[];
    users$: Observable<any> = new Observable();
    savedSearches: SearchSchema[];
  
    constructor( private router: Router, public auth: AuthenticationService, public trackedService: TrackedTripsService, private logger: NGXLogger) {
  
    }

    ngOnInit() {
      //this.productService.getProductsSmall().then(data => this.products = data);

      this.cols = [
          { field: 'ddate', header: 'Departure Date' },
          { field: 'daddress', header: 'Departure Address' },
          { field: 'adate', header: 'Return Date' },
          { field: 'aaddress', header: 'Arrival Address' },
          { field: 'cheapPrice', header: 'Cheapest Price' },
          { field: 'removeSearch', header: 'Remove Search' },
      ];

      //if logged in, load this user's saved searches.
      if (this.auth.isLoggedIn()) {
          this.users$ = this.trackedService.getUsersSearches(this.auth.getUserDetails()?.email||"marklim4@gmail.com");
          this.users$.subscribe(user => {
              this.savedSearches = user.trackedSearches;
          });
      }
  }

  deleteSavedTrip(savedTrip:SearchSchema) {
        if (this.auth.isLoggedIn()) {
            this.logger.info("deleting trip");
            //delete from database
            this.trackedService.deleteSavedTrip(savedTrip, this.auth.getUserDetails()?.email||"marklim4@gmail.com");

            //delete locally
            let indexOfSearch = this.savedSearches.findIndex(trip => trip == savedTrip);
            this.savedSearches.splice(indexOfSearch, 1);
        }

    }
  }