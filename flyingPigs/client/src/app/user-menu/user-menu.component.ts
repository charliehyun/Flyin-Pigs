import { Component, OnInit } from '@angular/core';
import {MessageService, PrimeNGConfig} from 'primeng/api';
import { AuthenticationService } from '../login-signup/authentication.service';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  providers: [MessageService]
})
export class UserMenuComponent {

  options: MenuItem[];

  constructor(public auth: AuthenticationService, private messageService: MessageService,
    private primengConfig: PrimeNGConfig) {
    
  }
  // show toast based on success/error
  showMessage(severity, summary, detail) {
    this.messageService.clear();
    this.messageService.add({severity: severity, summary: summary, detail: detail});
  }

  ngOnInit() {
    this.options = [
      {label: 'My Tracked Trips', routerLink: "/tracked-trips"},
      {label: 'My Account', routerLink: "/account"},
      {label: 'Logout', command: () => {this.handleLogOut();}},
  ];
  }

  handleLogOut() {
    this.messageService.add({severity: "success", summary: "Logged Out", detail: "Successfully logged out!"});
    this.auth.logout();
  }

}
