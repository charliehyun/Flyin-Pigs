import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.scss']
  })
  
  export class FeedbackComponent {
    email: string;
    comments: string;
  
    constructor( private router: Router) {
  
    }
  }