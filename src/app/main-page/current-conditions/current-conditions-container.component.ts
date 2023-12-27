import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocationService } from 'app/location.service';
import { ConditionsAndZip, TabTitle } from 'app/shared/models/sharedTypes';
import { WeatherService } from 'app/weather.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-current-conditions-container',
  templateUrl: './current-conditions-container.component.html',
  styleUrl: './current-conditions-container.component.css'
})
export class CurrentConditionsContainerComponent implements OnInit, OnDestroy {

  // Injection of WeatherService and LocationService.
  constructor(private weatherService: WeatherService, private locationService: LocationService) { }

  // Observable stream of current weather conditions.
  protected currentConditions$: Observable<ConditionsAndZip[]> = this.weatherService.currentConditions$;

  // Array to hold the current locations and their conditions.
  protected locations: ConditionsAndZip[] = [];

  // Variable to track the selected location.
  protected selectedLocation: ConditionsAndZip;

  // String to hold the URL of the weather icon for the selected location.
  protected weatherIcon: string;

  // Subject that emits when the component is destroyed, used for unsubscribing from Observables.
  private _onDestroy = new Subject<void>();

  protected tabsTitles: TabTitle[];

  ngOnInit(): void {
    // Method called on component initialization.
    this.takeCurrentConditions();
  }

  // Subscribes to the currentConditions$ Observable and updates component properties.
  takeCurrentConditions() {
    this.currentConditions$.pipe(takeUntil(this._onDestroy)).subscribe(locations => {
      // Updates the locations array with the latest data.
      this.locations = locations;
      //make titles for tabs
      this.tabsTitles = this.makeTabsTitles(this.locations);
      // If no location is selected, selects the first one and fetches its weather icon.      
      if (!this.selectedLocation) {
        this.selectedLocation = locations[0];
        if (this.selectedLocation) this.getWeatherIcon(this.selectedLocation);
      }
    });
  }

  makeTabsTitles(locations: ConditionsAndZip[]): TabTitle[] {
    return locations.map(location => ({
      title: location?.data?.name,
      subtitle: location.zip
    }));
  }


  // Method to select a location and update the weather icon.
  selectTab(event: TabTitle) {
    const zip = event.subtitle;
    const location = this.locations.find(location => location.zip === zip);
    if (location) {
      this.selectedLocation = location;
      this.getWeatherIcon(location);
    }

  }

  // Retrieves the weather icon URL for a given location.
  getWeatherIcon(location) {
    if (location.data.weather[0].id) {
      this.weatherIcon = this.weatherService.getWeatherIcon(location.data.weather[0].id);
    }
  }

  // Removes a location from the list when an event is triggered.
  removeLocation(event) {
    if (event.subtitle) {
      const zip = event.subtitle;
      this.locationService.removeLocation(zip);
      // Update the selected location if necessary.
      if (this.locations.length === 0) {
        this.selectedLocation = null;
      } else if (this.selectedLocation.zip === zip) {
        this.selectedLocation = this.locations[0];
        if (this.selectedLocation) this.getWeatherIcon(this.selectedLocation);
      }
    }
  }

  ngOnDestroy(): void {
    // Emits a signal to complete all active subscriptions on component destruction.
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
