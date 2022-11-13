import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {Message, MessageService} from 'primeng/api';
import {NGXLogger} from "ngx-logger";

@Component({
  selector: 'page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
  providers: [MessageService]
})

export class PageNotFoundComponent {
  email: string;
  service: any;

  constructor(private messageService: MessageService, private logger: NGXLogger) {

  }



}