import {Component} from '@angular/core';
import {FilterPanelComponent} from '@utility/presentation/component/panel/filter.panel.component';
import {SearchInputComponent} from '@utility/presentation/component/input/search.input.component';
import {debounceTime, firstValueFrom, map} from "rxjs";
import {Store} from "@ngxs/store";
import {FilterForm} from "@event/presentation/form/filter.form";
import {EventActions} from "@event/state/event/event.actions";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {RouterLink} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {MS_HALF_SECOND} from "@utility/domain/const/c.time";
import {clearObjectClone} from "@utility/domain/clear.object";
import {
	IonSelectEventStatusComponent
} from "@utility/presentation/component/input/ion/ion-select-event-status.component";
import {Reactive} from "@utility/cdk/reactive";
import {EventState} from "@event/state/event/event.state";

@Component({
	selector: 'event-filter-component',
	standalone: true,
	imports: [
		FilterPanelComponent,
		SearchInputComponent,
		PrimaryButtonDirective,
		RouterLink,
		TranslateModule,
		IonSelectEventStatusComponent
	],
	template: `
		<utility-filter-panel-component>
			<div class="flex items-center gap-3" start>
				<utility-search-input-component [control]="form.controls.phrase"/>
				<ion-select-event-status [control]="form.controls.status"/>
			</div>
			<ng-container end>
				<button type="button" primary routerLink="form">
					<i class="bi bi-plus-lg"></i>
					{{ 'keyword.capitalize.add-event' | translate }}
				</button>
			</ng-container>
		</utility-filter-panel-component>
	`
})
export class FilterComponent extends Reactive {
	public readonly form = new FilterForm();

	constructor(
		public readonly store: Store,
	) {
		super();
		this.store.select(EventState.tableState)
			.pipe(
				this.takeUntil(),
			)
			.subscribe(({filters}) => {
				Object.keys(filters).forEach((key) => {
					this.form.controls[key].patchValue(filters[key]);
				})
			});
		this.form.valueChanges.pipe(
			debounceTime(MS_HALF_SECOND),
			map(clearObjectClone)
		).subscribe(async (value) => {
			this.form.disable({
				emitEvent: false,
				onlySelf: true
			});
			await firstValueFrom(this.store.dispatch(new EventActions.UpdateFilters(value as any)));
			await firstValueFrom(this.store.dispatch(new EventActions.GetList()));
			this.form.enable({
				emitEvent: false,
				onlySelf: true
			});
		});
	}
}
