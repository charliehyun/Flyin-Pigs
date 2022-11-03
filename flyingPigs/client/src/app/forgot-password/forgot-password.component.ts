import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DataService } from "../data.service";

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})

export class ForgotPasswordComponent {
  subscription!: Subscription;
  email: string;

  constructor(private data: DataService, private router: Router) {

  }

  //backend calls

  forgotPassword() {
    this.resetValidity();
    let route = true;
    // input validation
    // TODO: check if email is in database
    // if valid, create search object and route to results
    // else, alert

    // if valid email in database, send link to email
    // have alert that says, "if email exists, then a reset email link will be sent to you"

    if(route) {
      
      //this.data.changeMessage(this.email)
      //this.router.navigate(['results'])
      alert("Email has been sent if you have an existing account with us!")
    }
  }
  
  resetValidity() {
    const elements: Element[] = Array.from(document.getElementsByTagName("input"));
    elements.forEach((el: Element) => {
      el.classList.remove('ng-invalid')
      el.classList.remove('ng-dirty')
      el.classList.add('ng-pristine')
    })
  }

}