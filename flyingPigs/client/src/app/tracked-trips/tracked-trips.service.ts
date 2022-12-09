import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import { SearchSchema } from '../searchSchema';
import { ResultInfoSchema} from '../flightSchema';
import {NGXLogger} from "ngx-logger";

@Injectable({
    providedIn: 'root'
})

export class TrackedTripsService {
    private url = 'http://localhost:5200';
    private users$: Subject<any> = new Subject();
    private trips$: Subject<ResultInfoSchema> = new Subject();

    constructor(private httpClient: HttpClient, private logger: NGXLogger) {

    }

    searchUsers(userEmail:string) {
        this.httpClient.post(`${this.url}/airports/getUser`, {email:userEmail})
            .subscribe(user => {
               this.users$.next(user);
            });
    }

    getUsersSearches(userEmail:string) {
        this.searchUsers(userEmail);
        return this.users$;
    }



    updateSearchRoute(userEmail:string, oTracked:any, nTracked:any) {
        this.httpClient.post(`${this.url}/airports/updateSearch`, {email:userEmail, tracked: oTracked, newTracked: nTracked})
        .subscribe(user => {
           this.users$.next(user);
        });
    }
    
    flightAPIRoute(searchParams) {
        this.httpClient.post<ResultInfoSchema>(`${this.url}/airports/search`, searchParams)
            .subscribe(trip => {
                this.trips$.next(trip);
            });
    }

    updateSearch(email:string, searchToUpdate:any) {
        let updatedSearch = Object.assign({}, searchToUpdate);

        let that = this;
        this.flightAPIRoute(searchToUpdate);
        this.trips$.subscribe(value => {
            if(value) {
                let minPriceNotCar = Math.min(...value.trips.filter(trip => trip.flightPrice != 0).map(trip => trip.flightPrice));
                updatedSearch.lastLowestPrice = minPriceNotCar;        
                this.updateSearchRoute(email, searchToUpdate, updatedSearch);
                // this.showMessage('success', 'Success', 'Successfully set address.');
            } else {
                // this.showMessage('error', 'Error', 'Unable to set address');
                that.logger.info("no value");
            }
        });
    }
    deleteSavedTrip(userInput:SearchSchema, userEmail:string) {
        let postObj = {'inputObject':userInput, 'email': userEmail};
        this.httpClient.post(`${this.url}/airports/deleteSavedTrip`, postObj).subscribe();
    }
}