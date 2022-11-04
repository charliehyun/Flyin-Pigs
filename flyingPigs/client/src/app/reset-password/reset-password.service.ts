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

    sendReset(tok: string, newPassword: string) {
        this.httpClient.post<boolean>(`${this.url}/airports/resetPassword`, {token: tok, password: newPassword})
            .subscribe(success => {
                this.resetPasswordSuccess$.next(success);
            });
    }

    resetPassword(token: string, newPassword: string): Subject<boolean> {
        this.sendReset(token, newPassword);
        return this.resetPasswordSuccess$;
    }
}