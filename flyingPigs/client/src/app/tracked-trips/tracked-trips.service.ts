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

    deleteSavedTrip(userInput:SearchSchema, userEmail:string) {
        let postObj = {'inputObject':userInput, 'email': userEmail};
        this.httpClient.post(`${this.url}/airports/deleteSavedTrip`, postObj).subscribe();
    }
}