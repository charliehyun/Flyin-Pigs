import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {MessageService} from 'primeng/api';
import { ResetPasswordService } from './reset-password.service';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  providers: [MessageService]
})

export class ResetPasswordComponent {
  newPass: string;
  confNewPass: string;

  constructor(private messageService: MessageService, private forgotPasswordService: ResetPasswordService) {
  }

  //backend calls
  // handle change password attempt. input validation
  results$: Observable<boolean> = new Observable();
  async handleResetPassword() {
    this.resetValidity()
    // check if all fields are populated
    let invalid = false;
    
    // check if password is empty
    if(!this.newPass) {
        const x = document.getElementById('newPass');
        x?.classList.add('ng-invalid')
        x?.classList.add('ng-dirty')
        invalid = true
    }

    // check if confirm password is empty
    if(!this.confNewPass) {
        const x = document.getElementById('confNewPass');
        x?.classList.add('ng-invalid')
        x?.classList.add('ng-dirty')
        invalid = true
    }

    if(invalid) {
        this.showMessage('error', 'Error', 'Unable to sign up. Invalid password.');
        return;
    }

    //check if password matches confirmed password
    if(this.newPass != this.confNewPass) {
        const x = document.getElementById('confNewPass');
        x?.classList.add('ng-invalid')
        x?.classList.add('ng-dirty')
        this.showMessage('error', 'Error', 'Passwords do not match');
        return;
    }

    // check if satisfies password reqs, and if so, reset password in database
    // 1 lowercase, 1 uppercase, 1 number, 1 special character, 8 min length
    if(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(this.newPass)) {
      let params = new URLSearchParams(location.search);
      let token = params.get('token') || "";
      console.log("TOKEN: ", token);
      this.forgotPasswordService.resetPassword(token, this.newPass).subscribe(value => {
        if(value) {
          this.showMessage('success', 'Success', 'Successfully changed password!');
        } else {
          this.showMessage('error', 'Error', 'Unable to update password. Invalid or expired token.');
        }
      });

        // if satisfies, then change password in database
        

        //  this.results$ = this.ResetPasswordService.signupUser(credentialsInput);

        // this.results$.subscribe(value => {
        //     if(value){
        //         this.displaySignup = false
        //         this.showMessage('success', 'Success', 'Successfully signed up. Log in to get started.');
        //     } else {
        //         this.showMessage('error', 'Error', 'Unable to sign up. Invalid email or password.');
        //     }
        // });
    } else {
        const x = document.getElementById('passS');
        x?.classList.add('ng-invalid')
        x?.classList.add('ng-dirty')
        this.showMessage('error', 'Error', 'Password does not satisfy all requirements.');
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

  // show toast based on success/error
  showMessage(severity, summary, detail) {
    this.messageService.clear();
    this.messageService.add({severity: severity, summary: summary, detail: detail});
  }

  ngOnInit() {
    
  }

}