import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page.component';
import { CurrentConditionsComponent } from './current-conditions/current-conditions/current-conditions.component';
import { CurrentConditionsContainerComponent } from './current-conditions/current-conditions-container.component';
import { ZipcodeEntryComponent } from './zipcode-entry/zipcode-entry.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';


export const routesMainPage: Routes = [
  {
    path: '',
    component: MainPageComponent
  }
];

@NgModule({
  declarations: [
    CurrentConditionsComponent,
    MainPageComponent,
    CurrentConditionsContainerComponent,
    ZipcodeEntryComponent
  ],
    
  imports: [
    CommonModule,
    RouterModule.forChild(routesMainPage),
    ReactiveFormsModule,
    SharedModule
  ] 
})
export class MainPageModule { }
