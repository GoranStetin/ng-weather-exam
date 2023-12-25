import { NgModule }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
  {
    path: '', 
    loadChildren: () => import('./main-page/main-page.module').then(m => m.MainPageModule),
    pathMatch: 'full'
  },
  {
    path: 'forecast/:zipcode',
    loadChildren: () => import('./forecasts-list/forecast-module.module').then(m => m.ForecastModuleModule),
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}


