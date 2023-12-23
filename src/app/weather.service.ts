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

  private cacheDuration = 2 * 60 * 60 * 1000;
  

  constructor(private http: HttpClient, private locationService: LocationService) {
    this.locationService.locations$.subscribe(locations => {
      this.loadCachedData(locations);
    });
    
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

  private loadCachedData(locations: string[]) {
    const currentConditions: ConditionsAndZip[] = [];
    locations.forEach(zipcode => {
      const cachedConditions = this.getCachedCurrentConditions(zipcode);
      if (cachedConditions) {
        currentConditions.push({ zip: zipcode, data: cachedConditions });
      }
    });
    // Emitujte podatke samo ako postoje keširani podaci
    if (currentConditions.length > 0) {
      this.currentConditionsSubject.next(currentConditions);
    }
  }

  setCacheDuration(milliseconds: number) {
    this.cacheDuration = milliseconds;
  }

  // Proverite da li postoji keširani odgovor za trenutne uslove
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

  // Keširajte odgovor za trenutne uslove
  private cacheCurrentConditions(zipcode: string, data: CurrentConditions) {
    const cacheKey = `current-conditions-${zipcode}`;
    const cacheEntry = {
      timestamp: new Date().getTime(),
      data: data
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
  }
 

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


  removeCurrentConditions(zipcode: string) {
    this.currentConditionsSubject.next(
      this.currentConditionsSubject.getValue().filter(condition => condition.zip !== zipcode)
    );

  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return
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
