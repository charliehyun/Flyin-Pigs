import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { AirportSchema } from '../airportSchema';

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    private url = 'http://localhost:5200';
    private airports$: Subject<AirportSchema[]> = new Subject();

    constructor(private httpClient: HttpClient) { }

    getAirports(): Subject<AirportSchema[]> {
        return this.airports$;
    }

    private getFiltered() {
        this.httpClient.get<AirportSchema[]>(`${this.url}/airports/filtered`)
            .subscribe(airports => {
                this.airports$.next(airports);
            });
    }

    filterAirports(): Subject<AirportSchema[]> {
        this.getFiltered();
        console.log("filtering Airports");
        return this.airports$;
    }
}