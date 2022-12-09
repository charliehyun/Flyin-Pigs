import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginSchema } from '../loginSchema';

export interface UserDetails {
  _id: string;
  email: string;
  // name: string;
  exp: number;
  // iat: number;
}

interface TokenResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private token: string;
  private url = 'http://localhost:5200';

  constructor(private http: HttpClient, private router: Router) {}

  private saveToken(token: string): void {
    sessionStorage.setItem('mean-token', token);
    this.token = token;
  }

  private getToken(): string {
    if (!this.token) {
      this.token = sessionStorage.getItem('mean-token') || '';
    }
    return this.token;
  }

  public getUserDetails(): UserDetails | null {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  public logout(): void {
    this.token = '';
    window.sessionStorage.removeItem('mean-token');
    this.router.navigateByUrl('/');
  }

  public signup(user: LoginSchema): Observable<any> {
    return this.request('post', 'signup', user);
  }
  
  public login(user: LoginSchema): Observable<any> {
    return this.request('post', 'login', user);
  }
  
  public account(): Observable<any> {
    return this.request('get', 'account');
  }

  private request(method: 'post'|'get', type: 'login'|'signup'|'account', user?: LoginSchema): Observable<any> {
    let base;
  
    if (method === 'post') {
      base = this.http.post(`${this.url}/airports/${type}`, user);
    } else {
      console.log("HMMM")
      base = this.http.get(`${this.url}/airports/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
      // base = this.http.get(`${this.url}/airports/acct`, { headers: { Authorization: `Bearer ${this.getToken()}` }});

    }
  
    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    ).subscribe();
    console.log("HI")
  
    return request;
  }
}
