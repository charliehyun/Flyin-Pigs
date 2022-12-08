import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {Message, MessageService} from 'primeng/api';
import { ForgotPasswordService } from './forgot-password.service';
import {NGXLogger} from "ngx-logger";
import { AuthenticationService } from '../login-signup/authentication.service';

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers: [MessageService]
})

export class ForgotPasswordComponent {
  email: string;
  service: any;

  constructor( public auth: AuthenticationService, private messageService: MessageService, private forgotPasswordService: ForgotPasswordService, private logger: NGXLogger) {

  }

  // show toast based on success/error
  showMessage(severity, summary, detail) {
    this.messageService.clear();
    this.messageService.add({severity: severity, summary: summary, detail: detail});
  }

  //backend calls
  results$: Observable<boolean> = new Observable();
  async handleForgotPassword() {
    // this.logger.info("forgot password component email:", this.email);

    if(!this.email) {
      const x = document.getElementById('email');
      x?.classList.add('ng-invalid')
      x?.classList.add('ng-dirty')
    }

    this.resetValidity();
    this.forgotPasswordService.sendEmail(this.email).subscribe(value => {
      if(value) {
        this.showMessage('success', 'Success', 'Successfully sent email');
      } else {
        this.showMessage('error', 'Error', 'Unable to send email. Invalid email or no account linked to provided email.');
      }
    });
    // let route = true;
    // input validation
    // TODO: check if email is in database
    // if valid, create search object and route to results
    // else, alert

    // if valid email in database, send link to email
    // have alert that says, "if email exists, then a reset email link will be sent to you"
    // if(route) {
    //this.data.changeMessage(this.email)
    //this.router.navigate(['results'])
    //   alert("Email has been sent if you have an existing account with us!")
    // }
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