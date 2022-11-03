import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { SearchSchema } from '../searchSchema';
import { FlightSchema, StopOverFlightSchema} from '../flightSchema';
import { LoginSchema } from '../loginSchema';
@Injectable({
    providedIn: 'root'
})
export class ForgotPasswordService {
    private url = 'http://localhost:5200';
    private forgotPasswordSuccess$: Subject<boolean> = new Subject();

    constructor(private httpClient: HttpClient) { }

    forgotPassword(em: string) {
        this.httpClient.post<boolean>(`${this.url}/airports/submitForgotPassword`, {email: em})
            .subscribe(success => {
                this.forgotPasswordSuccess$.next(success);
            });
    }

    sendEmail(email: string): Subject<boolean> {
        this.forgotPassword(email);
        return this.forgotPasswordSuccess$;
    }
}