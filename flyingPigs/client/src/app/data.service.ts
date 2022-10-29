import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SearchSchema, DropdownOption } from './searchSchema';

// Service to pass data between components (search to results)

@Injectable()
export class DataService {

  private messageSource = new BehaviorSubject<SearchSchema>({
    selectedClass: {name: 'Economy', code: 'Economy'},
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
    selectedDTransport: {name: 'Car', code: 'driving'},
    selectedATransport: {name: 'Car', code: 'driving'},
    maxTimeStart: {name: '3 hr', sec: 10800},
    maxTimeEnd: {name: '1 hr', sec: 3600}
  });
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(message: SearchSchema) {
    this.messageSource.next(message)
  }

}