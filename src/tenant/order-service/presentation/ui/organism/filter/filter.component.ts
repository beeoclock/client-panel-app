import {Component, input} from '@angular/core';
import {SearchInputComponent} from '@shared/presentation/component/input/search.input.component';
import {FilterForm} from "@tenant/order-service/presentation/form/filter.form";
import {TranslateModule} from "@ngx-translate/core";
import {BaseFilterComponent} from "@shared/base.filter.component";
import {DefaultPanelComponent} from "@shared/presentation/component/panel/default.panel.component";
import {AsyncPipe, NgTemplateOutlet} from "@angular/common";
import {AutoRefreshComponent} from "@shared/presentation/component/auto-refresh/auto-refresh.component";
import {ReactiveFormsModule} from "@angular/forms";
import {IonSelectStateComponent} from "@shared/presentation/component/input/ion/ion-select-state.component";
import {IonSelectMemberComponent} from "@shared/presentation/component/input/ion/ion-select-member.component";
import {IonSelectServiceComponent} from "@shared/presentation/component/input/ion/ion-select-service.component";
import {
	IonSelectOrderServiceStatusComponent
} from "@shared/presentation/component/input/ion/ion-select-order-service-status.component";
import {
	DateSliderControlComponent
} from "@tenant/analytic/presentation/component/control/date-slider/date-slider.control.component";

@Component({
	selector: 'order-service-filter-component',
	standalone: true,
	imports: [
		SearchInputComponent,
		TranslateModule,
		DefaultPanelComponent,
		AsyncPipe,
		NgTemplateOutlet,
		AutoRefreshComponent,
		ReactiveFormsModule,
		IonSelectStateComponent,
		IonSelectMemberComponent,
		IonSelectServiceComponent,
		IonSelectOrderServiceStatusComponent,
		DateSliderControlComponent
	],
	template: `
		<utility-default-panel-component>
			@if (isMobile$ | async) {
				<div class="flex gap-4 justify-between w-full p-2">
					<ng-container *ngTemplateOutlet="SearchInput"/>
				</div>

			} @else {

				<div class="flex overflow-x-auto gap-2 p-2">
					<ng-container *ngTemplateOutlet="SearchInput"/>
					<ng-container *ngTemplateOutlet="dateSliderSelect"/>
					<ng-container *ngTemplateOutlet="orderServiceStatusSelect"/>
					<ng-container *ngTemplateOutlet="memberSelect"/>
					<ng-container *ngTemplateOutlet="serviceSelect"/>
					<ng-container *ngTemplateOutlet="AutoRefresh"/>
					<ng-container *ngTemplateOutlet="stateSelect"/>
				</div>
			}
		</utility-default-panel-component>
		@if (isMobile$ | async) {
			<div class="flex overflow-x-auto gap-2 my-2 px-2">
				<ng-container *ngTemplateOutlet="dateSliderSelect"/>
				<ng-container *ngTemplateOutlet="orderServiceStatusSelect"/>
				<ng-container *ngTemplateOutlet="memberSelect"/>
				<ng-container *ngTemplateOutlet="serviceSelect"/>
				<ng-container *ngTemplateOutlet="AutoRefresh"/>
				<ng-container *ngTemplateOutlet="stateSelect"/>
			</div>
		}

		<ng-template #dateSliderSelect>
			<app-date-slider-control-component
				[form]="form.controls.dateRange"/>
		</ng-template>

		<ng-template #orderServiceStatusSelect>
			<ion-select-order-service-status
				[control]="form.controls.statuses"/>
		</ng-template>

		<ng-template #memberSelect>
			<ion-select-member
				[control]="form.controls.members"/>
		</ng-template>

		<ng-template #serviceSelect>
			<ion-select-service [control]="form.controls.services"/>
		</ng-template>

		<ng-template #stateSelect>
			<ion-select-state
				[control]="form.controls.state"/>
		</ng-template>

		<ng-template #SearchInput>
			<utility-search-input-component [formControl]="form.controls.phrase"/>
		</ng-template>

		<ng-template #AutoRefresh>
			<utility-auto-refresh-component id="customer-filter-auto-refresh" (emitter)="forceRefresh()"/>
		</ng-template>

	`
})
export class FilterComponent extends BaseFilterComponent {

	public readonly showButtonGoToForm = input(true);

	public override readonly form = new FilterForm();

	constructor() {
		super();
		super.initHandlers();
	}
}
