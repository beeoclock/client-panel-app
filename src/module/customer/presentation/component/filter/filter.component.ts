import {Component, inject} from '@angular/core';
import {FilterPanelComponent} from '@utility/presentation/component/panel/filter.panel.component';
import {SearchInputComponent} from '@utility/presentation/component/input/search.input.component';
import {debounceTime, firstValueFrom} from "rxjs";
import {FilterForm} from "@customer/presentation/form/filter.form";
import {Store} from "@ngxs/store";
import {CustomerActions} from "@customer/state/customer/customer.actions";

@Component({
  selector: 'customer-filter-component',
  standalone: true,
  imports: [
    FilterPanelComponent,
    SearchInputComponent
  ],
  template: `
    <utility-filter-panel-component>
      <utility-search-input-component [control]="form.controls.search"/>
    </utility-filter-panel-component>

  `
})
export class FilterComponent {
  public readonly store = inject(Store);
  public readonly form = new FilterForm();

  constructor() {
    this.form.valueChanges.pipe(
      debounceTime(500),
    ).subscribe(async (value) => {
      await firstValueFrom(this.store.dispatch(new CustomerActions.UpdateFilters(value)));
      await firstValueFrom(this.store.dispatch(new CustomerActions.GetList()));
    });
  }
}
