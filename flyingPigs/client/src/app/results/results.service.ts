import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, Subject, tap, lastValueFrom, take} from 'rxjs';
import { SearchSchema } from '../searchSchema';
import { FlightSchema, ResultInfoSchema, StopOverFlightSchema, TripSchema} from '../flightSchema';
@Injectable({
    providedIn: 'root'
})
export class ResultsService {
    private url = 'http://localhost:5200';
    private resultInfo$: Subject<ResultInfoSchema> = new Subject();
    constructor(private httpClient: HttpClient) { }

    sendSearch(inputObject:SearchSchema) {
        this.httpClient.post<ResultInfoSchema>(`${this.url}/airports/search`, inputObject)
            .subscribe(result => {
                this.resultInfo$.next(result);
            });
    }

    searchAirports(inputObject:SearchSchema): Subject<ResultInfoSchema> {
        this.sendSearch(inputObject);
        return this.resultInfo$;
    }

}