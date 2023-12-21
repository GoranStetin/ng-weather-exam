import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { Action, LOCATIONS } from './shared/models/constants';
import { LocationAction } from './shared/models/sharedTypes';



@Injectable({
  providedIn: 'root',
})
export class LocationService {

  locations: string[] = [];

  /* Locations subjects */
  private locationsSubject = new BehaviorSubject<LocationAction>({ locations: [], action: Action.NO_ACTION });
  locations$ = this.locationsSubject.asObservable();

  constructor() {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString)
      this.locations = JSON.parse(locString);
    this.locationsSubject.next({ locations: this.locations, action: Action.ADD_LOCATION });
  }

  /* Add new location to the view */
  addLocation(zipcode: string) {
    if (!this.locations.includes(zipcode)) {
      this.locations.push(zipcode);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
      this.locationsSubject.next({ locations: this.locations, action: Action.ADD_LOCATION });
    }

  }

  removeLocation(zipcode: string) {
    let index = this.locations.indexOf(zipcode);
    if (index !== -1) {
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
      this.locationsSubject.next({ locations: zipcode, action: Action.REMOVE_LOCATION });
    }
  }
}
