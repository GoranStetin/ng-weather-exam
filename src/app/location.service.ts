import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {

  // Array for storing locations (zip codes).
  locations: string[] = [];

  // BehaviorSubject that holds the current state of locations.
  // It emits new values to all subscribers whenever the list of locations changes.
  private locationsSubject = new BehaviorSubject<string[]>([]);
  // Publicly accessible Observable for tracking changes in locations.
  locations$ = this.locationsSubject.asObservable();

  constructor() {
    // Initializes the locations array from localStorage, filtering keys that match a specific pattern.
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      if (key && key.startsWith("current-conditions-")) {
        key = key.replace("current-conditions-", "");
        this.locations.push(key);
      }
    }
    // Notifying all subscribers about the initial list of locations.
    this.locationsSubject.next(this.locations);
  }

  /**
   * Adds a new location (zipcode) to the list.
   * If the location doesn't already exist in the list, it is added,
   * and the BehaviorSubject is notified to emit the updated list.
   * 
   * @param {string} zipcode - The zipcode to add.
   */
  addLocation(zipcode: string) {
    if (!this.locations.includes(zipcode)) {
      this.locations.push(zipcode);
      this.locationsSubject.next(this.locations);
    }
  }

  /**
   * Removes a location (zipcode) from the list.
   * Filters out the specified zipcode from the locations array,
   * removes the corresponding item from localStorage,
   * and updates the BehaviorSubject with the new list.
   * 
   * @param {string} zipcode - The zipcode to remove.
   */
  removeLocation(zipcode: string) {
    this.locations = this.locations.filter(location => location !== zipcode);
    const localStorageItem = "current-conditions-" + zipcode;
    localStorage.removeItem(localStorageItem);
    this.locationsSubject.next(this.locations);
  }
}
