import { Component, OnInit, Signal } from '@angular/core';
import { LocationService } from 'app/location.service';
import { ConditionsAndZip } from 'app/shared/models/sharedTypes';
import { WeatherService } from 'app/weather.service';

@Component({
  selector: 'app-current-conditions-container',
  templateUrl: './current-conditions-container.component.html',
  styleUrl: './current-conditions-container.component.css'
})
export class CurrentConditionsContainerComponent implements OnInit {

  constructor(private weatherService: WeatherService, locationService: LocationService) { }

 
  protected currentConditions: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();

  ngOnInit(): void {
    
  }


}
