import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ForecastsListComponent } from './forecasts-list.component';

export const routesForecast: Routes = [
  {
    path: '',
    component: ForecastsListComponent
  }
];

@NgModule({
  declarations: [ForecastsListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routesForecast),
  ]
})
export class ForecastModuleModule { }
