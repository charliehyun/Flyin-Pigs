import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DataService } from "../data.service";

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})

export class ResetPasswordComponent {
  subscription!: Subscription;
  email: string;

  constructor() {

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
      alert("Password has been reset!")

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


  passShowHide() {
    this.passHide = !this.passHide
}
  ngOnInit() {
    
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


}