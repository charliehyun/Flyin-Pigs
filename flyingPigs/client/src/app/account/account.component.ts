import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
  })
  
  export class AccountComponent {
    email: string;
    comments: string;
  
    constructor( private router: Router) {
  
    }
  }