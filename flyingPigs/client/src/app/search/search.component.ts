import { Component } from '@angular/core';
import { AuthenticationService } from '../login-signup/authentication.service';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent {

  constructor( public auth: AuthenticationService ) {

  }

}