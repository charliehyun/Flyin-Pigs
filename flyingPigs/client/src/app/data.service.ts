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
    departDate: "",
    returnDate: "",
    departAdd: "",
    departCoord: new google.maps.LatLng({"lat": 0, 'lng': 0}),
    arriveAdd: "",
    arriveCoord: new google.maps.LatLng({"lat": 0, 'lng': 0}),
    selectedTransport: {name: 'Car', code: 'Driving'},
    maxTimeStart: {name: '3 hr', code: '3 hr'},
    maxTimeEnd: {name: '1 hr', code: '1 hr'}
  });
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(message: SearchSchema) {
    this.messageSource.next(message)
  }

}