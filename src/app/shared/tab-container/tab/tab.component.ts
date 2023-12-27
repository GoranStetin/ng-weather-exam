import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TabTitle } from 'app/shared/models/sharedTypes';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css'],
  standalone: false
})
export class TabComponent {

  // Input property 'title' to receive a title for the tab.
  @Input() title: TabTitle;

  //  property 'active' to determine if the tab is currently active. Default is false.
  active: boolean = false;

  // Output event emitter for tab selection. Emits the data associated with the tab.
  @Output() onTabSelected: EventEmitter<TabTitle> = new EventEmitter();

  // Output event emitter for tab closure. Emits the data associated with the tab.
  @Output() onTabClosed: EventEmitter<TabTitle> = new EventEmitter();

  // Method to handle tab click events. Emits the tab's data when the tab is clicked.
  onTabClicked() {
    if (this.title) {
      this.onTabSelected.emit(this.title);
    }
  }

  // Method to handle close icon click events on the tab. Emits the tab's data for closure.
  onCloseClicked() {
    if (this.title) {
      this.onTabClosed.emit(this.title);
    }
  }
}
