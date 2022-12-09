import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import { SearchSchema } from '../searchSchema';
import { ResultInfoSchema} from '../flightSchema';
@Injectable({
    providedIn: 'root'
})

export class TrackedTripsService {
    private url = 'http://localhost:5200';
    private users$: Subject<any> = new Subject();

    constructor(private httpClient: HttpClient) {

    }

    getUsersSearches(email:string) {
        this.httpClient.get(`${this.url}/airports/user`)
            .subscribe(user => {
               this.users$.next(user);
            });
    }
}