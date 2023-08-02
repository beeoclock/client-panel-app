import {Component, inject} from '@angular/core';
import {FilterPanelComponent} from '@utility/presentation/component/panel/filter.panel.component';
import {SearchInputComponent} from '@utility/presentation/component/input/search.input.component';
import {debounceTime} from 'rxjs';
import {Store} from "@ngxs/store";
import {FilterForm} from "@member/form/filter.form";
import {MemberActions} from "@member/state/member/member.actions";

@Component({
  selector: 'member-filter-component',
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
  public readonly store = inject(Store);
  public readonly form = new FilterForm();

  constructor() {
    this.form.valueChanges.pipe(
      debounceTime(500),
    ).subscribe((value) => {
      this.store.dispatch(new MemberActions.UpdateFilters(<{ search: string }>value));
    });
  }
}