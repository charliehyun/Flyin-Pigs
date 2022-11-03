import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { SearchSchema, DropdownOption } from '../searchSchema';
import { Router } from '@angular/router';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { DataService } from "../data.service";
import { FlightSchema } from '../flightSchema';
import { LoginSignupService } from './login-signup.service';
import { LoginSchema } from '../loginSchema';
import {MessageService} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.scss'],
  providers: [MessageService]
//   styleUrls: ['../app.component.scss']
})

export class LoginSignupComponent {
    emailL: string;  // email input for login
    passL: string;   // password input for login

    emailS: string;  // email input for signup
    passS: string;   // password input for signup
    confPassS: string;   // confirm password input for signup

    displayLogin: boolean;  // show login modal
    displaySignup: boolean; // show signup modal

    passHide: boolean;  // show/hide password text

    currentUser: string = "";

    constructor(private messageService: MessageService, private primengConfig: PrimeNGConfig, private loginSignupService: LoginSignupService, private router: Router) {
        this.passHide = true
        this.displayLogin = false
        this.displaySignup = false
    }

    ngOnInit() {
        this.currentUser = sessionStorage.getItem('flyinPigsCurrentUser') || "";
        this.primengConfig.ripple = true;
    }

    showSuccessL() {
        this.messageService.clear();
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Successfully logged in.'});
    }

    showSuccessS() {
        this.messageService.clear();
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Successfully signed up. Log in to get started.'});
    }

    showErrorL() {
        this.messageService.clear();
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Unable to log in. Invalid email or password.'});
    }

    showErrorS() {
        this.messageService.clear();
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Unable to sign up. Invalid emial or password.'});
    }

    // login button clicked, show modal
    showLogin() {
        this.displayLogin = true;
    }

    // signup button clicked, show modal
    showSignup() {
        this.displaySignup = true;
    }

    // "don't have" or "already have" button pressed. switch to corresponding modal
    switchModal() {
        if(this.displayLogin) {
            this.displayLogin = false
            this.displaySignup = true
        } else if(this.displaySignup) {
            this.displayLogin = true
            this.displaySignup = false
        }
    }

    // show/hide password text
    passShowHide() {
        this.passHide = !this.passHide
    }

    // handle log out
    async handleLogOut() {
        this.resetValidity();
        this.currentUser = "";
        sessionStorage.removeItem("flyinPigsCurrentUser");
    }

    // handle login attempt. account validation
    results$: Observable<boolean> = new Observable();
    async handleLogin() {
        this.resetValidity();

        if(!this.emailL) {
            const x = document.getElementById('emailL');
            x?.classList.add('ng-invalid')
            x?.classList.add('ng-dirty')
        }

        if(!this.passL) {
            const x = document.getElementById('passL');
            x?.classList.add('ng-invalid')
            x?.classList.add('ng-dirty')
        }

        let credentialsInput: LoginSchema = {
            email: this.emailL,
            password: this.passL
        }

        this.results$ = this.loginSignupService.loginUser(credentialsInput);

        this.results$.subscribe(value => {
            if(value){
                this.displayLogin = false;
                this.currentUser = this.emailL;
                sessionStorage.setItem("flyinPigsCurrentUser", this.currentUser);
                this.showSuccessL();
            } else {
                this.showErrorL();
            }
        });
    }

    // handle signup attempt. input validation
    handleSignup() {
        this.resetValidity()
        // check if all fields are populated
        if(!this.emailS) {
            const x = document.getElementById('emailS');
            x?.classList.add('ng-invalid')
            x?.classList.add('ng-dirty')
        }
        if(!this.passS) {
            const x = document.getElementById('passS');
            x?.classList.add('ng-invalid')
            x?.classList.add('ng-dirty')
        }

        // check if password and confirm password match
        if(!this.confPassS ||this.passS != this.confPassS) {
            const x = document.getElementById('confPassS');
            x?.classList.add('ng-invalid')
            x?.classList.add('ng-dirty')
        }

        // TODO: check if satisfies password reqs
        // if satisfies, then call signupUser to check if email exists and to add to DB

        let credentialsInput: LoginSchema = {
            email: this.emailS,
            password: this.passS
        }

        this.results$ = this.loginSignupService.signupUser(credentialsInput);

        this.results$.subscribe(value => {
            if(value){
                this.displaySignup = false
                this.showSuccessS();
            } else {
                this.showErrorS();
            }
        });

    }

    handlePassword() {
        this.router.navigate(['forgot-password'])
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