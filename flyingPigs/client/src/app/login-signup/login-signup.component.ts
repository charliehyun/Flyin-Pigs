import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { ResultsService} from "../results/results.service";
import { SearchSchema, DropdownOption } from '../searchSchema';
import { Router } from '@angular/router';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { DataService } from "../data.service";
import { FlightSchema } from '../flightSchema';

// import {Client} from "@googlemaps/google-maps-services-js";

@Component({
  selector: 'login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.scss']
})

export class LoginSignupComponent {
    emailL: string
    passL: string

    emailS: string
    passS: string
    confPassS: string

    displayLogin: boolean;
    displaySignup: boolean;

    passHide: boolean

    constructor(private router: Router) {
        this.passHide = true
        this.displayLogin = false
        this.displaySignup = false

    }

    showLogin() {
        this.displayLogin = true;
    }

    showSignup() {
        this.displaySignup = true;
    }

    switchModal() {
        if(this.displayLogin) {
            this.displayLogin = false
            this.displaySignup = true
        } else if(this.displaySignup) {
            this.displayLogin = true
            this.displaySignup = false
        }
    }

    passShowHide() {
        this.passHide = !this.passHide
    }

    handleLogin() {
        // check database if valid credentials
        // if invalid, reprompt
        // if vaid, log in and close modal
    }

    handleSignup() {
        this.resetValidity()

        // check if password and confirm password match
        if(this.passS != this.confPassS) {
            const x = document.getElementById('confPassS');
            x?.classList.add('ng-invalid')
            x?.classList.add('ng-dirty')
        }

        // check database if already exists
        // check if satisfies password reqs
        // if invalid, reprompt
        // if valid new account, prompt to log in and close modal
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