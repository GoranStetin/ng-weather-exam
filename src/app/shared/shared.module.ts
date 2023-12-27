import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabComponent } from './tab-container/tab/tab.component';
import { TabContainerComponent } from './tab-container/tab-container.component';


@NgModule({
  declarations: [
    TabComponent,
    TabContainerComponent],
  imports: [
    CommonModule
  ],
  exports: [
    TabComponent,
    TabContainerComponent
  ]
})
export class SharedModule { }
