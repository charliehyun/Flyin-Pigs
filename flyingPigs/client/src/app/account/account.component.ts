import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from '../login-signup/authentication.service';
import { Observable } from 'rxjs';
import { AccountService } from "./account.service";

@Component({
    selector: 'account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
  })
  
  export class AccountComponent implements OnInit {
    address: string;
    password: string;
    confPassword: string;

    loginResults$: Observable<{success: boolean, token?: string, message: string}> = new Observable();
    signupResults$: Observable<boolean> = new Observable();

    constructor( public auth: AuthenticationService, private accountService: AccountService, private router: Router) {
    }
    ngOnInit(): void {
      // this.address = this.auth.getUserDetails()?.address || "";
    }
    handleResetPassword() {
      if(!this.password) {
        const x = document.getElementById('password');
        x?.classList.add('ng-invalid')
        x?.classList.add('ng-dirty')
      }
      if(this.password != this.confPassword) {
        const x = document.getElementById('confPassword');
        x?.classList.add('ng-invalid')
        x?.classList.add('ng-dirty')
        return;
      }
      this.loginResults$ = this.accountService.resetPassword(this.auth.getUserDetails()?.email || "", this.password);
      this.loginResults$.subscribe(value => {
          if(value) {
              // this.showMessage('success', 'Success', 'Successfully reset password.');
          } else {
              // this.showMessage('error', 'Error', 'Unable to reset password.');
          }
      });
    }
    handleSetAddress() {
      if(!this.address) {
        const x = document.getElementById('address');
        x?.classList.add('ng-invalid')
        x?.classList.add('ng-dirty')
      }
      this.loginResults$ = this.accountService.setAddress(this.auth.getUserDetails()?.email || "", this.address);
      this.loginResults$.subscribe(value => {
          if(value.success) {

              // this.showMessage('success', 'Success', 'Successfully set address.');
          } else {
              // this.showMessage('error', 'Error', 'Unable to set address');
          }
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