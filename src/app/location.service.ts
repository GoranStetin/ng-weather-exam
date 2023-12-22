import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LOCATIONS } from './shared/models/constants';


@Injectable({
  providedIn: 'root',
})
export class LocationService {

  locations: string[] = [];

  /* Locations subjects */
  private locationsSubject = new BehaviorSubject<string[]>([]);
  locations$ = this.locationsSubject.asObservable();

  constructor() {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString) {
      this.locations = JSON.parse(locString);
      this.locationsSubject.next(this.locations);
    }      
  }

  /* Add new location to the view */
  addLocation(zipcode: string) {
    if (!this.locations.includes(zipcode)) {
      this.locations.push(zipcode);
      this.locationsSubject.next(this.locations);
    }
  }

  removeLocation(zipcode: string) {    
    this.locations = this.locations.filter(location => location !== zipcode);     
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    this.locationsSubject.next(this.locations);    
  }
}
