import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { SearchSchema } from '../searchSchema';
import { FlightSchema, StopOverFlightSchema} from '../flightSchema';
import { LoginSchema } from '../loginSchema';
@Injectable({
    providedIn: 'root'
})
export class ResetPasswordService {
    private url = 'http://localhost:5200';
    private resetPasswordSuccess$: Subject<boolean> = new Subject();


    constructor(private httpClient: HttpClient) { }


    // sendSignup(inputObject:LoginSchema) {
    //     this.httpClient.post<boolean>(`${this.url}/airports/signup`, inputObject)
    //         .subscribe(success => {
    //             this.signupSuccess$.next(success);
    //         });
    // }

    // signupUser(inputObject:LoginSchema): Subject<boolean> {
    //     this.sendSignup(inputObject);
    //     return this.signupSuccess$;
    // }

}