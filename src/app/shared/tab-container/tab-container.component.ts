import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, QueryList, SimpleChanges, TemplateRef, ViewChildren } from '@angular/core';
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

  // input contentTemplates
  @Input() contentTemplates: TemplateRef<[]>[];

  // input tabContexts
  @Input() tabContexts: [];

  // Output event emitter for tab close. Emits the data associated with the tab.
  @Output() onTabClosed: EventEmitter<number> = new EventEmitter();

  selectedTabIndex = 0;

  ngAfterViewInit() {
    // Check if any tab is has activ true, if not it will set the first one as active;
    const activeTabs = this.tabs.filter(tab => tab.active);
    if (activeTabs.length === 0) {
      this.setTabActive(this.tabs.first);
    }
  }

  // Method to handle close icon click events on the tab. Emits the tab's data for closure.
  onCloseClicked(event: TabTitle, index: number) {
    this.onTabClosed.emit(index);
    this.selectTab(event, 0)
  }

  // Method to handle click on tab. Emits the tab's data for selection.
  selectTab(event: TabTitle, index: number) {
    const selectedTab = this.tabs.find(tab => tab.title.title === event.title);
    if (selectedTab) {
      this.setTabActive(selectedTab);
    }
    this.selectedTabIndex = index;
  }

  //  Method to set tab active
  setTabActive(tab: TabComponent) {
    this.tabs.toArray().forEach(t => t.active = false);
    tab.active = true;
    // Manually detect changes on active property in child component
    this.cdr.detectChanges();
  }


}
