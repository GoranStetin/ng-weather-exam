import { Injectable, Signal, signal } from '@angular/core';
import { EMPTY, Observable, from } from 'rxjs';
import { catchError, concatMap, filter, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ConditionsAndZip } from './shared/models/sharedTypes';
import { Forecast } from './forecasts-list/forecast.type';
import { LocationService } from './location.service';
import { Action } from './shared/models/constants';
import { CurrentConditions } from './shared/models/current-conditions.type';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {

  static URL = 'http://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  private currentConditions = signal<ConditionsAndZip[]>([]);

  constructor(private http: HttpClient, private locationService: LocationService) {
    this.locationService.locations$
      .pipe(
        filter(locationsActions => locationsActions && locationsActions.locations.length > 0),
        map(locationsActions => {
          if (locationsActions.action === Action.REMOVE_LOCATION && typeof locationsActions.locations === 'string') {
            this.removeCurrentConditions(locationsActions.locations);
            return EMPTY
          } else {
            return locationsActions.locations
          }
        }),
        concatMap(locations => from(locations)),
        concatMap(zipcode => this.addCurrentConditions(zipcode))
      ).subscribe();
  }

  addCurrentConditions(zipcode: string): Observable<CurrentConditions> {
    return this.http.get<CurrentConditions>(`${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`).
      pipe(
        catchError(() => {
          return EMPTY;
        }),
        tap(data => {
          if (!this.currentConditions().some(condition => condition.zip === zipcode)) {
            this.currentConditions.update(conditions => [...conditions, { zip: zipcode, data }]);
          }
        }))
  }

  removeCurrentConditions(zipcode: string) {
    this.currentConditions.update(conditions => {
      for (let i in conditions) {
        if (conditions[i].zip == zipcode)
          conditions.splice(+i, 1);
      }
      return conditions;
    })
  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
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
