import { Component } from "@angular/core";
import { Router } from '@angular/router';

@Component({
    selector: 'faq',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.scss']
  })
  
  export class FAQComponent {
    
  
    constructor( private router: Router) {
  
    }
  }

   