import {Component, inject} from '@angular/core';
import {FilterPanelComponent} from '@utility/presentation/component/panel/filter.panel.component';
import {SearchInputComponent} from '@utility/presentation/component/input/search.input.component';
import {EmployeeRepository} from "@employee/repository/employee.repository";

@Component({
  selector: 'employee-filter-component',
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
  public readonly repository = inject(EmployeeRepository);
  public readonly form = this.repository.filterForm;

  constructor() {
    this.form.valueChanges.subscribe(() => {
      this.repository.pagination.executeDelegate();
    });
  }
}
