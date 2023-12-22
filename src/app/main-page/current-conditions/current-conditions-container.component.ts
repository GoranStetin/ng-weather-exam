import { Component, OnDestroy, OnInit, Signal } from '@angular/core';
import { LocationService } from 'app/location.service';
import { ConditionsAndZip } from 'app/shared/models/sharedTypes';
import { WeatherService } from 'app/weather.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-current-conditions-container',
  templateUrl: './current-conditions-container.component.html',
  styleUrl: './current-conditions-container.component.css'
})
export class CurrentConditionsContainerComponent implements OnInit, OnDestroy {

  constructor(private weatherService: WeatherService, private locationService: LocationService) { }

  protected currentConditions$: Observable<ConditionsAndZip[]> = this.weatherService.currentConditions$;

  protected locations: ConditionsAndZip[] = [];

  protected selectedLocation: ConditionsAndZip;

  protected weatherIcon: string;

  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();

  ngOnInit(): void {
    this.currentConditions$.pipe(takeUntil(this._onDestroy)).subscribe(locations => {
      this.locations = locations;
      if(!this.selectedLocation) {
        this.selectedLocation = locations[0];
      }
      
    })
  }

  selectTab(location: ConditionsAndZip) {
    this.selectedLocation = location;
    if (location) this.getWeatherIcon(location);
  }

  getWeatherIcon(location) {
    if (location.data.weather[0].id) {
      this.weatherIcon = this.weatherService.getWeatherIcon(location.data.weather[0].id);
    }
  }

  removeLocation(event) {
    if(event.zip) {
      const zip = event.zip
      this.locationService.removeLocation(zip);
      if (this.locations.length === 0) {
        this.selectedLocation = null;
      } else if (this.selectedLocation.zip === zip) {
        this.selectedLocation = this.locations[0];
      }
    }    
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
