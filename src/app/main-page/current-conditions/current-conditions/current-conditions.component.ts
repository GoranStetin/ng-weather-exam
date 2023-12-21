import {Component, Input, inject} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent {

  /* Input specific location data with current condition */
  @Input() location;

  private router = inject(Router); 

  showForecast(zipcode : string){
    this.router.navigate(['/forecast', zipcode])
  }
}
