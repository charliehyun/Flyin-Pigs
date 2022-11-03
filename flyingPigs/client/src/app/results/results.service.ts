import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, Subject, tap, lastValueFrom, take} from 'rxjs';
import { SearchSchema } from '../searchSchema';
import { FlightSchema, StopOverFlightSchema, TripSchema} from '../flightSchema';
@Injectable({
    providedIn: 'root'
})
export class ResultsService {
    private url = 'http://localhost:5200';
    private trips$: Subject<TripSchema[]> = new Subject();
    constructor(private httpClient: HttpClient) { }

    sendSearch(inputObject:SearchSchema) {
        this.httpClient.post<TripSchema[]>(`${this.url}/airports/search`, inputObject)
            .subscribe(trip => {
                this.trips$.next(trip);
            });
    }

    searchAirports(inputObject:SearchSchema): Subject<TripSchema[]> {
        this.sendSearch(inputObject);
        return this.trips$;
    }

    // clearAirports(): Subject<TripSchema[]> {
    //     this.trips$ = new Subject();
    //     return this.trips$;
    // }

    
}