import {Component} from '@angular/core';
import {SearchInputComponent} from '@utility/presentation/component/input/search.input.component';

@Component({
  selector: 'utility-filter-panel-component',
  standalone: true,
  imports: [
    SearchInputComponent
  ],
  template: `
    <ng-content></ng-content>
  `
})
export class FilterPanelComponent {

}
