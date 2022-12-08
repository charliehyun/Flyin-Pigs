import { Component } from "@angular/core";
import { Observable } from 'rxjs';
// import {Message, MessageService} from 'primeng/api';
import { FeedbackService } from './feedback.service';
import {NGXLogger} from "ngx-logger";
import { AuthenticationService } from '../login-signup/authentication.service';

@Component({
  selector: 'feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})

export class FeedbackComponent {
  email: string;
  comments: string;
  // TODO: make a type drop down with options: Feedback and Complaint and then .toLowerCase
  type = "complaint";

  constructor( public auth: AuthenticationService, private feedbackService: FeedbackService, private logger: NGXLogger ) {

      }
  // show toast based on success/error
  // showMessage(severity, summary, detail) {
  //   this.messageService.clear();
  //   this.messageService.add({severity: severity, summary: summary, detail: detail});
  // }

  //backend calls
  results$: Observable<boolean> = new Observable();
  async handleFeedback() {
    // this.logger.info("forgot password component email:", this.email);

    if(this.auth.isLoggedIn()) {
      this.email = this.auth.getUserDetails()?.email || '';
    }
    else {
      if(!this.email) {
        const x = document.getElementById('email');
        x?.classList.add('ng-invalid')
        x?.classList.add('ng-dirty')
      }
    }

    this.resetValidity();
    this.feedbackService.sendFeedback(this.email, this.type, this.comments).subscribe(value => {
      // if(value) {
      //   this.showMessage('success', 'Success', 'Successfully sent email');
      // } else {
      //   this.showMessage('error', 'Error', 'Unable to send email. Invalid email or no account linked to provided email.');
      // }
    });
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