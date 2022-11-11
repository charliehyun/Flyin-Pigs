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
  }