import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { SearchSchema } from '../searchSchema';
import { FlightSchema, StopOverFlightSchema} from '../flightSchema';
@Injectable({
    providedIn: 'root'
})
export class ResultsService {
    private url = 'http://localhost:5200';
    private flights$: Subject<FlightSchema[][]> = new Subject();

    constructor(private httpClient: HttpClient) { }

    sendSearch(inputObject:SearchSchema) {
        this.httpClient.post<FlightSchema[][]>(`${this.url}/airports/search`, inputObject)
            .subscribe(flight => {
                this.flights$.next(flight);
            });
    }

    searchAirports(inputObject:SearchSchema): Subject<FlightSchema[][]> {
        this.sendSearch(inputObject);
        console.log("sending search");
        return this.flights$;
    }

}