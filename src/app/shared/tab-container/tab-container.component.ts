import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, ContentChildren, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { TabTitle } from '../models/sharedTypes';
import { TabComponent } from './tab/tab.component';

@Component({
  selector: 'app-tab-container',
  templateUrl: './tab-container.component.html',
  styleUrls: ['./tab-container.component.css'],
  standalone: false
})

export class TabContainerComponent implements AfterViewInit {
  // cdr will manually detect changes after updating a child component's property
  constructor(private cdr: ChangeDetectorRef) { }


  @ViewChildren(TabComponent) tabs: QueryList<TabComponent>;

  // input titles that will be shown in the tabs
  @Input() titles: TabTitle[];

  // Output event emitter for tab close. Emits the data associated with the tab.
  @Output() onTabClosed: EventEmitter<TabTitle> = new EventEmitter();

  // Output event emitter for tab selection. Emits the data associated with the tab.
  @Output() onTabSelected: EventEmitter<TabTitle> = new EventEmitter();

  // Method to handle close icon click events on the tab. Emits the tab's data for closure.
  onCloseClicked(event: TabTitle) {
    this.onTabClosed.emit(event);
  }

  // Method to handle click on tab. Emits the tab's data for selection.
  selectTab(event: TabTitle) {
    this.onTabSelected.emit(event);
    const selectedTab = this.tabs.find(tab => tab.title.title === event.title);
    if (selectedTab) {
      this.setTabActive(selectedTab);
    }

  }

  ngAfterViewInit() {
    // Check if any tab is has activ true, if not it will set the first one as active;
    const activeTabs = this.tabs.filter(tab => tab.active);
    if (activeTabs.length === 0) {
      this.setTabActive(this.tabs.first);
    }
  }

  //  Method to set tab active
  setTabActive(tab: TabComponent) {
    this.tabs.toArray().forEach(t => t.active = false);
    tab.active = true;
    // Manually detect changes on active property in child component
    this.cdr.detectChanges();
  }


}
