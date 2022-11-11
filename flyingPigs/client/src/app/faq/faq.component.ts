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

    //footer handlers
    goToSearch() {
        this.router.navigate(['search'])
    }
    
    goToFAQ() {
      this.router.navigate(['faq'])
    }
    
    goToFeedback() {
      this.router.navigate(['feedback'])
    }
    
    goToGithub() {
        window.location.href = "https://github.com/jyeh00/Flyin-Pigs"
    }
    

  }

   