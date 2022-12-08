import { AuthenticationService } from '../login-signup/authentication.service';
import { Component, OnInit } from '@angular/core';
import {PrimeIcons} from 'primeng/api';
@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent {

  constructor( public auth: AuthenticationService ) {

  }

}