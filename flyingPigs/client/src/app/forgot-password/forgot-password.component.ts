import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
//import { SearchService } from "./search.service";
//import { AirportSchema } from "../airportSchema";
import { SearchSchema, DropdownOption } from '../searchSchema';
import { ForgotPasswordSchema } from '../forgotPasswordSchema';
import { Router } from '@angular/router';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { DataService } from "../data.service";
import {FlightSchema} from "../flightSchema";
import {Message} from 'primeng/api';
// import {Client} from "@googlemaps/google-maps-services-js";

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})

export class ForgotPasswordComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
    
  constructor(private data: DataService, private router: Router, private fb: FormBuilder) {
  // COPY START
    this.createForm();
  }

  //google autocomplete stuff.
  email= "";
  //backend calls

  

  async handleEmail() {
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
    
  createForm() {
    
  }
  // COPY END

  // DIFFERENT FROM RESULTS
  ngOnInit() {
    
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}