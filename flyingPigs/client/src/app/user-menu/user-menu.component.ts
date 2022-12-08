import { Component, OnInit } from '@angular/core';
import {MessageService} from 'primeng/api';
import { AuthenticationService } from '../login-signup/authentication.service';
@Component({
  selector: 'user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  providers: [MessageService]
})
export class UserMenuComponent implements OnInit {

  constructor(public auth: AuthenticationService, private messageService: MessageService) {

  }
  // show toast based on success/error
  showMessage(severity, summary, detail) {
    this.messageService.clear();
    this.messageService.add({severity: severity, summary: summary, detail: detail});
  }

  ngOnInit(): void {
  }

  handleLogOut() {
    this.messageService.add({severity: "success", summary: "Logged Out", detail: "Successfully logged out!"});
    this.auth.logout();
  }

}
