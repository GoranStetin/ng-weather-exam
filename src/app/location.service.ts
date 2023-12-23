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
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      if (key.startsWith("current-conditions-")) {
        key = key.replace("current-conditions-", "");
        this.locations.push(key);
      }
    }
    this.locationsSubject.next(this.locations);
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
    let localStorageItem = "current-conditions-" + zipcode;
    localStorage.removeItem(localStorageItem)
    this.locationsSubject.next(this.locations);
  }
}
