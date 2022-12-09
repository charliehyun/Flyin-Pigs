import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class SearchBoxService {
    private url = 'http://localhost:5200';
    private getUserSuccess$: Subject<string> = new Subject();

    constructor(private httpClient: HttpClient) { }
    
    userPath(em: string) {
        console.log("in set address route");
        this.httpClient.post<any>(`${this.url}/airports/setAddress`, {email: em})
        .subscribe(success => {
            this.getUserSuccess$.next(success);
        });
    }
    
    getUser(email: string): Observable<any> {
        this.getUser(email);
        return this.getUserSuccess$;
    }
}