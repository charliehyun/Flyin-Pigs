import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticationService, UserDetails } from '../login-signup/authentication.service';

@Component({
    selector: 'account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
  })
  
  export class AccountComponent implements OnInit {
    details: UserDetails;
    email: string;

    results$: Observable<any> = new Observable();  // original results returned from backend
  
    constructor(public auth: AuthenticationService) {
  
    }

    ngOnInit() {    
      this.results$ = this.auth.account()
      
      // this.results$.subscribe(user => {
      //   this.details = user;
      // }, (err) => {
      //   console.error(err);
      // });

      console.log("DETAILS", this.details)
    }
  }