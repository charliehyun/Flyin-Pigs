import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService, UserDetails } from '../login-signup/authentication.service';
import { Observable } from 'rxjs';
import { AccountService } from "./account.service";
import { UserService } from '../user.service';
import { MessageService } from "primeng/api";
import {Options} from "ngx-google-places-autocomplete/objects/options/options";

@Component({
    selector: 'account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
    providers: [MessageService]
  })
  
  export class AccountComponent implements OnInit {
    details: UserDetails;
    email: string;

    results$: Observable<any> = new Observable();  // original results returned from backend
  
  
    address: string;
    password: string;
    confPassword: string;

    passwordResult$: Observable<boolean> = new Observable();
    addressResult$: Observable<boolean> = new Observable();
    userResult$: Observable<any> = new Observable();

    constructor( public auth: AuthenticationService, private userService: UserService, private accountService: AccountService, private router: Router, private messageService: MessageService) {
      this.address = "";
    }

    ngOnInit(): void {
      this.results$ = this.auth.account()
    
      this.results$.subscribe(user => {
        this.details = user;
      }, (err) => {
        console.error(err);
        this.router.navigate(['page-not-found'])
      });

      // this.address = this.auth.getUserDetails()?.address || "";

      this.userResult$ = this.userService.getUser(this.auth.getUserDetails()?.email || "");
      this.userResult$.subscribe(value => {
          if(value.address) {
            this.address = value.address;
          } else {
          }
      });
    }

    // show toast based on success/error
    showMessage(severity, summary, detail) {
      this.messageService.clear();
      this.messageService.add({severity: severity, summary: summary, detail: detail});
    }

    handleResetPassword() {
      this.resetValidity();
      if(!this.password) {
        const x = document.getElementById('password');
        x?.classList.add('ng-invalid')
        x?.classList.add('ng-dirty')
        this.showMessage('error', 'Error', 'Passwords field is empty');
        return;
      }

      if(this.password != this.confPassword) {
        const x = document.getElementById('confPassword');
        x?.classList.add('ng-invalid')
        x?.classList.add('ng-dirty')
        this.showMessage('error', 'Error', 'Passwords do not match');
        return;
      }

      this.passwordResult$ = this.accountService.resetPassword(this.auth.getUserDetails()?.email || "", this.password);
      this.passwordResult$.subscribe(value => {
        if(value) {
          this.showMessage('success', 'Success', 'Successfully reset password.');
        } else {
          this.showMessage('error', 'Error', 'Unable to reset password.');
        }
      });
    }

    handleSetAddress() {
      this.resetValidity();
      this.addressResult$ = this.accountService.setAddress(this.auth.getUserDetails()?.email || "", this.address);
      this.addressResult$.subscribe(value => {
        if(value) {
          this.showMessage('success', 'Success', 'Successfully set address.');
        } else {
          this.showMessage('error', 'Error', 'Unable to set address');
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

  // Google autocomplete stuff
  options:Options = new Options({
    componentRestrictions:{
      country:"US"}
  });
  AddressChange1(address: any) {
    this.address = address.formatted_address;
  }
  }