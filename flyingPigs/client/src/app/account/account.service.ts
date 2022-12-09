import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class AccountService {
    private url = 'http://localhost:5200';
    private passwordSuccess$: Subject<boolean> = new Subject();
    private addressSuccess$: Subject<boolean> = new Subject();

    constructor(private httpClient: HttpClient) { }

    resetPasswordRoute(em: string, pa: string) {
        this.httpClient.post<boolean>(`${this.url}/airports/loggedInResetPassword`, {email: em, password:pa})
            .subscribe(success => {
                this.passwordSuccess$.next(success);
            });
    }
    
    setAddressRoute(em: string, ad: string) {
        this.httpClient.post<boolean>(`${this.url}/airports/setAddress`, {email: em, address:ad})
        .subscribe(success => {
            this.addressSuccess$.next(success);
        });
    }
    
    resetPassword(email: string, password: string): Observable<any> {
        this.resetPasswordRoute(email, password);
        return this.passwordSuccess$;
    }
    setAddress(email: string, address:string): Observable<any> {
        this.setAddressRoute(email, address);
        return this.addressSuccess$;
    }
}