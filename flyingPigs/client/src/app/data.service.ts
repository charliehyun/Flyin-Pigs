import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Service to pass data between components (search to results)

@Injectable()
export class DataService {

  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(message: string) {
    this.messageSource.next(message)
  }

}