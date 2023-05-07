import {Component, inject} from '@angular/core';
import {FilterPanelComponent} from '@utility/presentation/component/panel/filter.panel.component';
import {SearchInputComponent} from '@utility/presentation/component/input/search.input.component';
import {ServiceRepository} from '@service/repository/service.repository';
import {debounceTime} from "rxjs";

@Component({
  selector: 'service-filter-component',
  standalone: true,
  imports: [
    FilterPanelComponent,
    SearchInputComponent
  ],
  template: `
    <utility-filter-panel-component>
      <utility-search-input-component [control]="form.controls.search"></utility-search-input-component>
    </utility-filter-panel-component>

  `
})
export class FilterComponent {
  public readonly repository = inject(ServiceRepository);
  public readonly form = this.repository.filterForm;

  constructor() {
    this.form.valueChanges.pipe(
      debounceTime(500),
    ).subscribe(() => {
      this.repository.pagination.executeDelegate();
    });
  }
}
