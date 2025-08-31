import {Component, input} from '@angular/core';
import {SearchInputComponent} from '@shared/presentation/ui/component/input/search.input.component';
import {FilterForm} from "@tenant/customer/presentation/form/filter.form";
import {PrimaryButtonDirective} from "@shared/presentation/directives/button/primary.button.directive";
import {TranslateModule} from "@ngx-translate/core";
import {BaseFilterComponent} from "@shared/base.filter.component";
import {DefaultPanelComponent} from "@shared/presentation/ui/component/panel/default.panel.component";
import {AsyncPipe, NgTemplateOutlet} from "@angular/common";
import {AutoRefreshComponent} from "@shared/presentation/ui/component/auto-refresh/auto-refresh.component";
import {ReactiveFormsModule} from "@angular/forms";
import {IonSelectStateComponent} from "@shared/presentation/ui/component/input/ion/ion-select-state.component";
import {
	CustomerPresentationActions
} from "@tenant/customer/infrastructure/state/presentation/customer.presentation.actions";
import {CustomerDataState} from "@tenant/customer/infrastructure/state/data/customer.data.state";

@Component({
	selector: 'customer-filter-component',
	standalone: true,
	imports: [
		SearchInputComponent,
		PrimaryButtonDirective,
		TranslateModule,
		DefaultPanelComponent,
		AsyncPipe,
		NgTemplateOutlet,
		AutoRefreshComponent,
		ReactiveFormsModule,
		IonSelectStateComponent
	],
	template: `
		<utility-default-panel-component>
			@if (isMobile$ | async) {
				<div class="flex gap-4 justify-between w-full p-2">
					<ng-container *ngTemplateOutlet="SearchInput" />
					<ng-container *ngTemplateOutlet="ButtonToOpenForm" />
				</div>

			} @else {

				<div class="flex overflow-x-auto gap-2 p-2">
					<ng-container *ngTemplateOutlet="SearchInput" />
					<ng-container *ngTemplateOutlet="CustomerActiveSelect" />
					<ng-container *ngTemplateOutlet="AutoRefresh" />
				</div>
				<div class="p-2">
					<ng-container *ngTemplateOutlet="ButtonToOpenForm" />
				</div>
			}
		</utility-default-panel-component>
		@if (isMobile$ | async) {
			<div class="flex overflow-x-auto gap-2 my-2 px-2">
				<ng-container *ngTemplateOutlet="CustomerActiveSelect" />
				<ng-container *ngTemplateOutlet="AutoRefresh" />
			</div>
		}

		<ng-template #CustomerActiveSelect>
			<ion-select-state
				[control]="form.controls.state"/>
		</ng-template>

		<ng-template #SearchInput>
			<utility-search-input-component [formControl]="form.controls.phrase"/>
		</ng-template>

		<ng-template #AutoRefresh>
			<utility-auto-refresh-component id="customer-filter-auto-refresh" (emitter)="forceRefresh()"/>
		</ng-template>

		<ng-template #ButtonToOpenForm>
			@if (showButtonGoToForm()) {
				<button type="button" primary class="!py-3 !px-4 !text-base flex-1"
						(click)="openForm()">
					<i class="bi bi-plus-lg"></i>
					<!--				<span class="hidden xl:block">-->
					<!--					{{ 'customer.button.create' | translate }}-->
					<!--				</span>-->
				</button>
			}
		</ng-template>
	`
})
export class FilterComponent extends BaseFilterComponent {

	public readonly showButtonGoToForm = input(true);

	public override readonly form = new FilterForm();
	public override readonly state = CustomerDataState;

	constructor() {
		super();
		super.initHandlers();
	}

	public openForm() {
		this.store.dispatch(new CustomerPresentationActions.OpenForm());
	}
}
