import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { SearchSchema } from '../searchSchema';
import { FlightSchema, StopOverFlightSchema} from '../flightSchema';
import { LoginSchema } from '../loginSchema';
import { ForgotPasswordSchema } from '../forgotPasswordSchema';
@Injectable({
    providedIn: 'root'
})
export class ForgotPasswordService {
    private url = 'http://localhost:5200';
    private emailSuccess$: Subject<boolean> = new Subject();


    constructor(private httpClient: HttpClient) { }

    sendForgotPassword(inputObject:ForgotPasswordSchema) {
        this.httpClient.post<boolean>(`${this.url}/airports/forgotPassword`, inputObject)
            .subscribe(success => {
                this.emailSuccess$.next(success);
            });
    }

    loginUser(inputObject:ForgotPasswordSchema): Subject<boolean> {
        this.sendForgotPassword(inputObject);
        return this.emailSuccess$;
    }

}