import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import { SearchSchema } from '../searchSchema';
import { ResultInfoSchema} from '../flightSchema';
@Injectable({
    providedIn: 'root'
})
export class ResultsService {
    private url = 'http://localhost:5200';
    private trips$: Subject<ResultInfoSchema> = new Subject();
    constructor(private httpClient: HttpClient) { }

    sendSearch(inputObject:SearchSchema) {
        this.httpClient.post<ResultInfoSchema>(`${this.url}/airports/search`, inputObject)
            .subscribe(trip => {
                this.trips$.next(trip);
            });
    }

    searchAirports(inputObject:SearchSchema): Subject<ResultInfoSchema> {
        this.sendSearch(inputObject);
        return this.trips$;
    }


    //make new api call here.

    // clearAirports(): Subject<TripSchema[]> {
    //     this.trips$ = new Subject();
    //     return this.trips$;
    // }
}