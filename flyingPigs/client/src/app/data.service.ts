import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SearchSchema, DropdownOption } from './searchSchema';

// Service to pass data between components (search to results)

@Injectable()
export class DataService {

  private messageSource = new BehaviorSubject<SearchSchema>({
    selectedClass: {name: 'Economy', code: 'E'},
    isRoundTrip: false,
    adultPass: 1,
    childPass: 0,
    infantPass: 0,
    totalPass: 0,
    departAdd: "",
    arriveAdd: "",
    selectedTransport: {name: 'Car', code: 'Driving'},
    maxTimeStart: 1,
    maxTimeEnd: 1
  });
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(message: SearchSchema) {
    this.messageSource.next(message)
  }

}