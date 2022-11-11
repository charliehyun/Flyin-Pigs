import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.scss']
  })
  
  export class FeedbackComponent {
    
  
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