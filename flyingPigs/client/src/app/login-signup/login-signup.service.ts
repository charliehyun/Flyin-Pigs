import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { LoginSchema } from '../loginSchema';
@Injectable({
    providedIn: 'root'
})
export class LoginSignupService {
    private url = 'http://localhost:5200';
    private loginSuccess$: Subject<boolean> = new Subject();
    private signupSuccess$: Subject<boolean> = new Subject();


    constructor(private httpClient: HttpClient) { }

    sendLogin(inputObject:LoginSchema) {
        this.httpClient.post<boolean>(`${this.url}/airports/login`, inputObject)
            .subscribe(success => {
                this.loginSuccess$.next(success);
            });
    }

    loginUser(inputObject:LoginSchema): Subject<boolean> {
        this.sendLogin(inputObject);
        return this.loginSuccess$;
    }

    sendSignup(inputObject:LoginSchema) {
        this.httpClient.post<boolean>(`${this.url}/airports/signup`, inputObject)
            .subscribe(success => {
                this.signupSuccess$.next(success);
            });
    }

    signupUser(inputObject:LoginSchema): Subject<boolean> {
        this.sendSignup(inputObject);
        return this.signupSuccess$;
    }

}