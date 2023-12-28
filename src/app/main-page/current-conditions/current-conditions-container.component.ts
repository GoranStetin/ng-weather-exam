import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, QueryList, TemplateRef, ViewChildren } from '@angular/core';
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
export class CurrentConditionsContainerComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChildren('tabContentTemplate') tabContentTemplatesQueryList: QueryList<TemplateRef<unknown>>;
  tabContentTemplates: TemplateRef<unknown>[] = [];

  // Injection of WeatherService and LocationService.
  constructor(private weatherService: WeatherService,
    private locationService: LocationService,
    private cdr: ChangeDetectorRef
  ) { }

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

  tabContexts = [];

  ngOnInit(): void {
    // Method called on component initialization.
    this.takeCurrentConditions();
  }

  ngAfterViewInit(): void {
    this.tabContentTemplates = this.tabContentTemplatesQueryList.toArray();
    this.cdr.detectChanges();
  }

  // Subscribes to the currentConditions$ Observable and updates component properties.
  takeCurrentConditions() {
    this.currentConditions$.pipe(takeUntil(this._onDestroy)).subscribe(locations => {
      // Updates the locations array with the latest data.
      this.locations = locations;
      //make titles for tabs
      this.tabsTitles = this.makeTabsTitles(this.locations);
      this.tabContexts = this.locations.map(location => ({
        $implicit: location,
        weatherIcon: this.setWeatherIcon(location.data.weather[0].id)
      }));
    });
  }

  setWeatherIcon(weatherIconId): string {
    if (weatherIconId) {
      return this.weatherIcon = this.weatherService.getWeatherIcon(weatherIconId);
    }
    return '';
  }

  makeTabsTitles(locations: ConditionsAndZip[]): TabTitle[] {
    return locations.map(location => ({
      title: location?.data?.name,
      subtitle: location.zip
    }));
  }

  // Removes a location from the list when an event is triggered.
  removeLocation(event: number) {
    let zip: string;
    zip = this.tabContexts[event].$implicit.zip ?? '';
    if (zip) {
      this.locationService.removeLocation(zip);
    }
  }

  ngOnDestroy(): void {
    // Emits a signal to complete all active subscriptions on component destruction.
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
