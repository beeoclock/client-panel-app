import {Component, inject} from '@angular/core';
import {FilterPanelComponent} from '@utility/presentation/component/panel/filter.panel.component';
import {SearchInputComponent} from '@utility/presentation/component/input/search.input.component';
import {debounceTime, firstValueFrom} from "rxjs";
import {Store} from "@ngxs/store";
import {FilterForm} from "@event/presentation/form/filter.form";
import {EventActions} from "@event/state/event/event.actions";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {RouterLink} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {HALF_SECOND} from "@utility/domain/const/c.time";

@Component({
	selector: 'event-filter-component',
	standalone: true,
	imports: [
		FilterPanelComponent,
		SearchInputComponent,
		PrimaryButtonDirective,
		RouterLink,
		TranslateModule
	],
	template: `
		<utility-filter-panel-component>
			<utility-search-input-component start [control]="form.controls.phrase"/>
			<ng-container end>
				<button type="button" primary routerLink="form">
					<i class="bi bi-plus-lg"></i>
					{{ 'keyword.capitalize.add-event' | translate }}
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
			debounceTime(HALF_SECOND),
		).subscribe(async (value) => {
			console.log(value);
			await firstValueFrom(this.store.dispatch(new EventActions.UpdateFilters(value as any)));
			await firstValueFrom(this.store.dispatch(new EventActions.GetList()));
		});
	}
}
