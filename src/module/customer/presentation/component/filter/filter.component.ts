import {Component} from '@angular/core';
import {FilterPanelComponent} from '@utility/presentation/component/panel/filter.panel.component';
import {SearchInputComponent} from '@utility/presentation/component/input/search.input.component';
import {debounceTime, firstValueFrom, map} from "rxjs";
import {FilterForm} from "@customer/presentation/form/filter.form";
import {Store} from "@ngxs/store";
import {CustomerActions} from "@customer/state/customer/customer.actions";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {MS_HALF_SECOND} from "@utility/domain/const/c.time";
import {IonSelectActiveComponent} from "@utility/presentation/component/input/ion/ion-select-active.component";
import {clearObjectClone} from "@utility/domain/clear.object";
import {CustomerState} from "@customer/state/customer/customer.state";
import {Reactive} from "@utility/cdk/reactive";

@Component({
	selector: 'customer-filter-component',
	standalone: true,
	imports: [
		FilterPanelComponent,
		SearchInputComponent,
		PrimaryButtonDirective,
		TranslateModule,
		RouterLink,
		IonSelectActiveComponent
	],
	template: `
		<utility-filter-panel-component>
			<div class="flex gap-3 items-center" start>
				<utility-search-input-component [control]="form.controls.phrase"/>
				<ion-select-active [control]="form.controls.active"/>
			</div>
			<ng-container end>
				<button type="button" primary routerLink="form">
					<i class="bi bi-plus-lg"></i>
					{{ 'customer.button.create' | translate }}
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
		this.store.select(CustomerState.tableState)
			.pipe(
				this.takeUntil(),
			)
			.subscribe(({filters}) => {
				Object.keys(filters).forEach((key) => {
					this.form.controls[key].patchValue(filters[key]);
				})
			});
		this.form.valueChanges.pipe(
			this.takeUntil(),
			debounceTime(MS_HALF_SECOND),
			map(clearObjectClone)
		).subscribe(async (value) => {
			this.form.disable({
				emitEvent: false,
				onlySelf: true
			});
			await firstValueFrom(this.store.dispatch(new CustomerActions.UpdateFilters(value as any)));
			await firstValueFrom(this.store.dispatch(new CustomerActions.GetList()));
			this.form.enable({
				emitEvent: false,
				onlySelf: true
			});
		});
	}
}
