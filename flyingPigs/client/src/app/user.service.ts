import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class UserService {
    private url = 'http://localhost:5200';
    private getUserSuccess$: Subject<any> = new Subject();

    constructor(private httpClient: HttpClient) { }
    
    userRoute(em: string) {
        console.log("in set address route");
        this.httpClient.post<any>(`${this.url}/airports/getUser`, {email: em})
        .subscribe(success => {
            this.getUserSuccess$.next(success);
        });
    }
    
    getUser(email: string): Observable<any> {
        this.userRoute(email);
        return this.getUserSuccess$;
    }
}