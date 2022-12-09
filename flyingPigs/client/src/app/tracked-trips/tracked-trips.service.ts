import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import { SearchSchema } from '../searchSchema';
@Injectable({
    providedIn: 'root'
})

export class TrackedTripsService {
    private url = 'http://localhost:5200';
    private users$: Subject<any> = new Subject();

    constructor(private httpClient: HttpClient) {

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
    updateSearch(email:string, searchToUpdate:any) {
        delete searchToUpdate.lastLowestPrice;
        let updatedSearch = Object.assign({}, searchToUpdate);
        updatedSearch.lastLowestPrice = 12345;

        this.updateSearchRoute(email, searchToUpdate, updatedSearch);
    }
    deleteSavedTrip(userInput:SearchSchema, userEmail:string) {
        let postObj = {'inputObject':userInput, 'email': userEmail};
        this.httpClient.post(`${this.url}/airports/deleteSavedTrip`, postObj).subscribe();
    }
}