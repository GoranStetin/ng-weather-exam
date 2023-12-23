import { Component } from '@angular/core';
import { WeatherService } from '../weather.service';
import { ActivatedRoute } from '@angular/router';
import { Forecast } from './forecast.type';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css']
})
export class ForecastsListComponent {

  forecast$: Observable<Forecast>;
  zipcode: string;

  constructor(protected weatherService: WeatherService, protected route: ActivatedRoute) { }

  ngOnInit() {
    this.forecast$ = this.route.params.pipe(
      switchMap(params => {
        this.zipcode = params['zipcode'];
        return this.weatherService.getForecast(this.zipcode);
      })
    );
  }

}
