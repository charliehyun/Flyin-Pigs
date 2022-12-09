import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService, UserDetails } from '../login-signup/authentication.service';

@Component({
    selector: 'account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
  })
  
  export class AccountComponent implements OnInit {
    details: UserDetails;
    email: string;
  
    constructor(private auth: AuthenticationService) {
  
    }

    ngOnInit() {    
      this.auth.account().subscribe(user => {
        this.details = user;
      }, (err) => {
        console.error(err);
      });

      console.log("DETAILS", this.details)
    }
  }