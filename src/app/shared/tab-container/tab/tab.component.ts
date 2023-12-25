import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [],
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent {
  // Input property 'data' to receive data for the tab.
  @Input() data: any;

  // Input property 'title' to receive a title for the tab.
  @Input() title: any;

  // Input property 'active' to determine if the tab is currently active. Default is false.
  @Input() active: boolean = false;

  // Output event emitter for tab selection. Emits the data associated with the tab.
  @Output() onTabSelected: EventEmitter<any> = new EventEmitter();

  // Output event emitter for tab closure. Emits the data associated with the tab.
  @Output() onTabClosed: EventEmitter<any> = new EventEmitter();

  // Method to handle tab click events. Emits the tab's data when the tab is clicked.
  onTabClicked() {
    if (this.data) {
      this.onTabSelected.emit(this.data);
    }
  }

  // Method to handle close icon click events on the tab. Emits the tab's data for closure.
  onCloseClicked() {
    if (this.data) {
      this.onTabClosed.emit(this.data);
    }
  }
}
