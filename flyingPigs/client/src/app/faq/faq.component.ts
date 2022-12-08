import { Component } from "@angular/core";
import { Router } from '@angular/router';
import { AuthenticationService } from '../login-signup/authentication.service';

@Component({
    selector: 'faq',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.scss']
  })
  
  export class FAQComponent {
    
  
    constructor( public auth: AuthenticationService, private router: Router) {
  
    }
  }

   