import {Component, inject} from '@angular/core';
import {FilterPanelComponent} from '@utility/presentation/component/panel/filter.panel.component';
import {SearchInputComponent} from '@utility/presentation/component/input/search.input.component';
import {ServiceFormRepository} from '@service/repository/service.form.repository';

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
  public readonly repository: ServiceFormRepository = inject(ServiceFormRepository);
  public readonly form = this.repository.filterForm;

  constructor() {
    this.form.valueChanges.subscribe(() => {
      this.repository.updateState();
    });
  }
}
