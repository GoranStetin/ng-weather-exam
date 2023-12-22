import { Component, OnInit, Signal } from '@angular/core';
import { LocationService } from 'app/location.service';
import { ConditionsAndZip } from 'app/shared/models/sharedTypes';
import { WeatherService } from 'app/weather.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-current-conditions-container',
  templateUrl: './current-conditions-container.component.html',
  styleUrl: './current-conditions-container.component.css'
})
export class CurrentConditionsContainerComponent implements OnInit {

  constructor(private weatherService: WeatherService,private locationService: LocationService) { }
 
  protected currentConditions$: Observable<ConditionsAndZip[]>;

  ngOnInit(): void {
   this.currentConditions$ = this.weatherService.currentConditions$;
  }

  selectTab(location) {
    console.log(location)
  }

  removeLocation(zip) {
    this.locationService.removeLocation(zip)
  }

}
