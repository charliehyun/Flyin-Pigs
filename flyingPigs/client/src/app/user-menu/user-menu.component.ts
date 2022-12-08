import { Component, OnInit } from '@angular/core';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  providers: [MessageService]
})
export class UserMenuComponent implements OnInit {

  constructor(private messageService: MessageService) {

  }

  ngOnInit(): void {

  }
  
  handleLogout() {
    this.messageService.add({severity: "success", summary: "Logged Out", detail: "Successfully logged out!"});
    console.log("hi")
  }

}
