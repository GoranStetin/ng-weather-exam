import {Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent {

  /* Input specific location data with current condition */
  @Input() location;

  /* Input weather icon */
  @Input() weatherIcon;

}
