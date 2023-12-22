import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [],
  templateUrl: './tab.component.html',
  styleUrls: [ './tab.component.css']
})
export class TabComponent {
  @Input() data: any;
  @Input() title: any;
  @Input() active: boolean = false;
  @Output() onTabSelected: EventEmitter<any> = new EventEmitter();
  @Output() onTabClosed: EventEmitter<any> = new EventEmitter();

  
    onTabClicked() {
      if(this.data) {
        this.onTabSelected.emit(this.data);
      }
    }
  
  
    onCloseClicked() {
      if(this.data) {
        this.onTabClosed.emit(this.data);
      }
      
    }

}
