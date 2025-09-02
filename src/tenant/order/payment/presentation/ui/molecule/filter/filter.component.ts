import {Component, input, OnInit} from '@angular/core';
import {SearchInputComponent} from '@shared/presentation/ui/component/input/search.input.component';
import {FilterForm} from "@tenant/order/payment/presentation/form/filter.form";
import {TranslateModule} from "@ngx-translate/core";
import {PrimaryButtonDirective} from "@shared/presentation/directives/button/primary.button.directive";
import {BaseFilterComponent} from "@shared/base.filter.component";
import {DefaultPanelComponent} from "@shared/presentation/ui/component/panel/default.panel.component";
import {AsyncPipe, NgTemplateOutlet} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {PaymentDataState} from "@tenant/order/payment/infrastructure/state/data/payment-data.state";
import {
	PaymentPresentationActions
} from "@tenant/order/payment/infrastructure/state/presentation/payment.presentation.actions";
import {
	IonSelectPaymentStatusComponent,
} from "@shared/presentation/ui/component/input/ion/ion-select-payment-status.component";
import {IonSelectStateComponent} from "@shared/presentation/ui/component/input/ion/ion-select-state.component";
import {
	DateSliderControlComponent
} from "@tenant/analytic/presentation/component/control/date-slider/date-slider.control.component";

@Component({
	selector: 'payment-filter-component',
	standalone: true,
	imports: [
		SearchInputComponent,
		TranslateModule,
		PrimaryButtonDirective,
		DefaultPanelComponent,
		AsyncPipe,
		NgTemplateOutlet,
		ReactiveFormsModule,
		IonSelectStateComponent,
		IonSelectPaymentStatusComponent,
		DateSliderControlComponent,
	],
	template: `
		<utility-default-panel-component>
			@if (isMobile$ | async) {
				<div class="flex gap-4 justify-between w-full p-2">
					<ng-container *ngTemplateOutlet="SearchInput"/>
					<!--					<ng-container *ngTemplateOutlet="ButtonToOpenForm"/>-->
				</div>
			} @else {

				<div class="flex overflow-x-auto gap-2 p-2">
					<ng-container *ngTemplateOutlet="SearchInput"/>
					<ng-container *ngTemplateOutlet="DateRange"/>
					<ng-container *ngTemplateOutlet="PaymentStatusSelect"/>
<!--					<app-export-button/>-->
<!--					<ng-container *ngTemplateOutlet="StateSelect"/>-->
				</div>
				<div>
					<!--					<ng-container *ngTemplateOutlet="ButtonToOpenForm"/>-->
				</div>
			}
		</utility-default-panel-component>
		@if (isMobile$ | async) {
			<div class="flex overflow-x-auto gap-2 my-2 px-2">
				<ng-container *ngTemplateOutlet="DateRange"/>
				<ng-container *ngTemplateOutlet="PaymentStatusSelect"/>
<!--				<ng-container *ngTemplateOutlet="StateSelect"/>-->
			</div>
		}

		<ng-template #DateRange>
			<app-date-slider-control-component
				[form]="form.controls.dateRange"/>
		</ng-template>

		<ng-template #StateSelect>
			<ion-select-state
				[control]="form.controls.state"/>
		</ng-template>

		<ng-template #PaymentStatusSelect>
			<ion-select-payment-status
				[control]="form.controls.status"/>
		</ng-template>

		<ng-template #SearchInput>
			<utility-search-input-component
				[formControl]="form.controls.phrase"/>
		</ng-template>

		<ng-template #ButtonToOpenForm>
			@if (showButtonGoToForm()) {

				<button type="button" class="!py-3 !px-4 !text-base flex-1" primary
						(click)="openForm()">
					<i class="bi bi-plus-lg"></i>
					<!--				<span class="hidden xl:block">-->
					<!--					{{ 'keyword.capitalize.add-service' | translate }}-->
					<!--				</span>-->
				</button>
			}
		</ng-template>
	`
})
export class FilterComponent extends BaseFilterComponent implements OnInit {

	public readonly showButtonGoToForm = input(true);

	public override readonly form = new FilterForm();
	public override readonly state = PaymentDataState;

	public ngOnInit() {
		super.initHandlers();
	}

	@Dispatch()
	public openForm() {
		return new PaymentPresentationActions.OpenForm();
	}
}
