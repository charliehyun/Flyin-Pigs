import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DataService } from "../data.service";
import {MessageService} from 'primeng/api';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  providers: [MessageService]
})

export class ResetPasswordComponent {
  subscription!: Subscription;
  newPass: string;
  confNewPass: string;
  passHide: boolean;  // show/hide password text

  constructor(private messageService: MessageService) {

  }

  //backend calls

  // handle change password attempt. input validation
  results$: Observable<boolean> = new Observable();
  handleResetPassword() {
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
        this.showMessage('error', 'Error', 'Unable to sign up. Invalid email or password.');
        alert("Error!")
        return;
    }

    //check if password matches confirmed password
    if(this.newPass != this.confNewPass) {
        const x = document.getElementById('confNewPass');
        x?.classList.add('ng-invalid')
        x?.classList.add('ng-dirty')
        this.showMessage('error', 'Error', 'Passwords do not match');
        alert("Passwords don't match!")
        return;
    }

    // check if satisfies password reqs, and if so, reset password in database
    // 1 lowercase, 1 uppercase, 1 number, 1 special character, 8 min length
    if(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(this.newPass)) {
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
        this.showMessage('success', 'Success', 'Successfully changed password! Log in to get started.');
        alert("Password has been reset!")
    } else {
        const x = document.getElementById('passS');
        x?.classList.add('ng-invalid')
        x?.classList.add('ng-dirty')
        this.showMessage('error', 'Error', 'Password does not satisfy all requirements.');
        alert("Password doesn't satisfy all requirements!")
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

  passShowHide() {
    this.passHide = !this.passHide
}
  ngOnInit() {
    
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


}