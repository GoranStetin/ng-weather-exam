import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ConditionsAndZip } from './shared/models/sharedTypes';
import { Forecast } from './forecasts-list/forecast.type';
import { LocationService } from './location.service';
import { CurrentConditions } from './shared/models/current-conditions.type';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {

  // Base URL for the OpenWeatherMap API
  static URL = 'https://api.openweathermap.org/data/2.5';

  // API key for the OpenWeatherMap API
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';

  // Base URL for weather condition icons
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';

  // BehaviorSubject to manage the current conditions state.
  private currentConditionsSubject = new BehaviorSubject<ConditionsAndZip[]>([]);

  // Observable to expose the current conditions to other parts of the app.
  currentConditions$ = this.currentConditionsSubject.asObservable();

  // Duration in milliseconds for which the cached data is considered valid.
  private cacheDuration = 2 * 60 * 60 * 1000;


  constructor(private http: HttpClient, private locationService: LocationService) {
    // Subscribes to the locations$ observable to manage the loading and caching of weather data.
    this.locationService.locations$.subscribe(locations => {
      this.loadCachedData(locations);
    });

    // Uses switchMap to handle changes in locations and manage the addition or removal of weather data.
    this.locationService.locations$.pipe(
      switchMap(locations => {
        // Add current zips
        const currentZipcodes = this.currentConditionsSubject.getValue().map(cond => cond.zip);

        // Create an array of Observables for adding new conditions.
        // For each new zip code, create an Observable using the 'addCurrentConditions' method.
        const addConditionsObservables = locations
          .filter(zip => !currentZipcodes.includes(zip))
          .map(zip => this.addCurrentConditions(zip));

        // Create an array of Observables for removing conditions.
        // For each zip code that needs to be removed, create an Observable using the 'removeCurrentConditions' method wrapped in 'of' 
        // because 'removeCurrentConditions' does not return an Observable.
        const removeConditionsObservables = currentZipcodes
          .filter(zip => !locations.includes(zip))
          .map(zip => of(this.removeCurrentConditions(zip)));
        return forkJoin([...addConditionsObservables, ...removeConditionsObservables]);
      })
    ).subscribe();
  }

  // Loads cached weather data for given locations.
  private loadCachedData(locations: string[]) {
    const currentConditions: ConditionsAndZip[] = [];
    locations.forEach(zipcode => {
      const cachedConditions = this.getCachedCurrentConditions(zipcode);
      if (cachedConditions) {
        currentConditions.push({ zip: zipcode, data: cachedConditions });
      }
    });

    if (currentConditions.length > 0) {
      this.currentConditionsSubject.next(currentConditions);
    }
  }

  // Sets the duration for which cache data remains valid.
  setCacheDuration(milliseconds: number) {
    this.cacheDuration = milliseconds;
  }

  // Retrieves cached current conditions for a specific zipcode, if available.
  private getCachedCurrentConditions(zipcode: string): CurrentConditions | null {
    const cacheKey = `current-conditions-${zipcode}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const entry = JSON.parse(cached);
      const now = new Date().getTime();
      if (now - entry.timestamp < this.cacheDuration) {
        return entry.data;
      } else {
        localStorage.removeItem(cacheKey);
      }
    }
    return null;
  }

  // Caches the current weather conditions for a specific zipcode.
  private cacheCurrentConditions(zipcode: string, data: CurrentConditions) {
    const cacheKey = `current-conditions-${zipcode}`;
    const cacheEntry = {
      timestamp: new Date().getTime(),
      data: data
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
  }

  // Adds current weather conditions for a given zipcode to the observable stream.
  addCurrentConditions(zipcode: string): Observable<CurrentConditions> {
    const cachedConditions = this.getCachedCurrentConditions(zipcode);
    if (cachedConditions) {
      return of(cachedConditions);
    } else {
      return this.http.get<CurrentConditions>(`${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`)
        .pipe(
          tap((conditions) => {
            this.cacheCurrentConditions(zipcode, conditions);
            let currentConditions = this.currentConditionsSubject.getValue();
            currentConditions = [...currentConditions, { zip: zipcode, data: conditions }];
            this.currentConditionsSubject.next(currentConditions);
          }),
          catchError(error => {
            console.error(`Error fetching conditions for ${zipcode}:`, error);
            return of(null);
          })
        );
    }
  }

  // Fetches the weather forecast for a given zipcode.
  getForecast(zipcode: string): Observable<Forecast> {
    const cacheKey = `forecast-${zipcode}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const entry = JSON.parse(cached);
      const now = new Date().getTime();
      if (now - entry.timestamp < this.cacheDuration) {
        return of(entry.data);
      } else {
        localStorage.removeItem(cacheKey);
      }
    }
    return this.http.get<Forecast>(`${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`)
      .pipe(
        tap((forecast) => {
          const cacheEntry = {
            timestamp: new Date().getTime(),
            data: forecast
          };
          localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
        }),
        catchError(error => {
          console.error(`Error fetching forecast for ${zipcode}:`, error);
          return of(null);
        })
      );
  }

  // Removes current conditions data for a specific zipcode from the observable stream.
  removeCurrentConditions(zipcode: string) {
    this.currentConditionsSubject.next(
      this.currentConditionsSubject.getValue().filter(condition => condition.zip !== zipcode)
    );
  }

  // Determines the appropriate weather icon based on the weather condition ID.
  getWeatherIcon(id): string {
    if (id >= 200 && id <= 232)
      return WeatherService.ICON_URL + "art_storm.png";
    else if (id >= 501 && id <= 511)
      return WeatherService.ICON_URL + "art_rain.png";
    else if (id === 500 || (id >= 520 && id <= 531))
      return WeatherService.ICON_URL + "art_light_rain.png";
    else if (id >= 600 && id <= 622)
      return WeatherService.ICON_URL + "art_snow.png";
    else if (id >= 801 && id <= 804)
      return WeatherService.ICON_URL + "art_clouds.png";
    else if (id === 741 || id === 761)
      return WeatherService.ICON_URL + "art_fog.png";
    else
      return WeatherService.ICON_URL + "art_clear.png";
  }

}
