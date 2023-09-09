import {Component, inject} from '@angular/core';
import {FilterPanelComponent} from '@utility/presentation/component/panel/filter.panel.component';
import {SearchInputComponent} from '@utility/presentation/component/input/search.input.component';
import {debounceTime, firstValueFrom} from "rxjs";
import {Store} from "@ngxs/store";
import {FilterForm} from "@customer/presentation/form/filter.form";
import {ServiceActions} from "@service/state/service/service.actions";
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";

@Component({
  selector: 'service-filter-component',
  standalone: true,
	imports: [
		FilterPanelComponent,
		SearchInputComponent,
		TranslateModule,
		RouterLink,
		PrimaryButtonDirective
	],
  template: `
		<utility-filter-panel-component>
			<utility-search-input-component start [control]="form.controls.search"/>
			<ng-container end>
				<button type="button" primary routerLink="form">
					<i class="bi bi-plus-lg"></i>
					{{ 'keyword.capitalize.add-service' | translate }}
				</button>
			</ng-container>
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
      await firstValueFrom(this.store.dispatch(new ServiceActions.UpdateFilters(<{ search: string }>value)));
      await firstValueFrom(this.store.dispatch(new ServiceActions.GetList()));
    });
  }
}
