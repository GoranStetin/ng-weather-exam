import { Injectable, Signal } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ConditionsAndZip } from './shared/models/sharedTypes';
import { Forecast } from './forecasts-list/forecast.type';
import { LocationService } from './location.service';
import { LOCATIONS } from './shared/models/constants';
import { CurrentConditions } from './shared/models/current-conditions.type';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {

  static URL = 'http://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';

  private currentConditionsSubject = new BehaviorSubject<ConditionsAndZip[]>([]);
  currentConditions$ = this.currentConditionsSubject.asObservable();

  constructor(private http: HttpClient, private locationService: LocationService) {
    this.locationService.locations$.pipe(
      switchMap(locations => {
        // Dohvatanje trenutnih zip kodova
        const currentZipcodes = this.currentConditionsSubject.getValue().map(cond => cond.zip);
        // Mapiramo lokacije u niz Observable-a za dodavanje uslova
        const addConditionsObservables = locations
          .filter(zip => !currentZipcodes.includes(zip))
          .map(zip => this.addCurrentConditions(zip));
        // Mapiramo trenutne zip kodove u niz Observable-a za uklanjanje uslova
        const removeConditionsObservables = currentZipcodes
          .filter(zip => !locations.includes(zip))
          .map(zip => of(this.removeCurrentConditions(zip)));

        // Kombinujemo sve Observable-e u jedan koristeći forkJoin
        // forkJoin će sačekati da se sve završe pre emitovanja
        return forkJoin([...addConditionsObservables, ...removeConditionsObservables]);
      })
    ).subscribe();

  }

  addCurrentConditions(zipcode: string): Observable<CurrentConditions> {
    return this.http.get<CurrentConditions>(`${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`).
      pipe(
        tap((conditions) => {
          let currentConditions = this.currentConditionsSubject.getValue();
          currentConditions = [...currentConditions, { zip: zipcode, data: conditions }];
          this.setLocationToLocalStorage(zipcode);
          this.currentConditionsSubject.next(currentConditions);
        }),
        catchError(error => {
          console.error(`Error fetching conditions for ${zipcode}:`, error);
          return of(null);
        })
      )
  }

  //set the new value to the local storage just in case there is no error in request
  setLocationToLocalStorage(zipcode) {
    const locString = localStorage.getItem(LOCATIONS);
    let locations = JSON.parse(locString);
    if (!locations) {
        // Initialize locations as an empty array if it's null/undefined
        locations = [];
    }
    if (!locations.includes(zipcode)) {
        // Add the zipcode if it's not already in the array
        locations.push(zipcode);
        localStorage.setItem(LOCATIONS, JSON.stringify(locations));
    }

  }

  removeCurrentConditions(zipcode: string) {
    this.currentConditionsSubject.next(
      this.currentConditionsSubject.getValue().filter(condition => condition.zip !== zipcode)
    );

  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return
  }

  getForecast(zipcode: string): Observable<Forecast> {
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.http.get<Forecast>(`${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`);

  }

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
