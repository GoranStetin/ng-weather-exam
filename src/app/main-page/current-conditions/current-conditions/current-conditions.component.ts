import {Component, Input, OnInit, inject} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent implements OnInit {

  /* Input specific location data with current condition */
  @Input() location;

  /* Input weather icon */
  @Input() weatherIcon;

  private router = inject(Router); 

  ngOnInit(): void {
    console.log(this.location)
  }

  showForecast(zipcode : string){
    this.router.navigate(['/forecast', zipcode])
  }
}
