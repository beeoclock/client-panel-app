import {Component, Input} from '@angular/core';
import {FilterPanelComponent} from '@utility/presentation/component/panel/filter.panel.component';
import {SearchInputComponent} from '@utility/presentation/component/input/search.input.component';
import {FilterForm} from "@customer/presentation/form/filter.form";
import {CustomerActions} from "@customer/state/customer/customer.actions";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {TranslateModule} from "@ngx-translate/core";
import {IonSelectActiveComponent} from "@utility/presentation/component/input/ion/ion-select-active.component";
import {CustomerState} from "@customer/state/customer/customer.state";
import {BaseFilterComponent} from "@utility/base.filter.component";
import {DefaultPanelComponent} from "@utility/presentation/component/panel/default.panel.component";
import {IonSelectWrapperComponent} from "@utility/presentation/component/input/ion/ion-select-wrapper.component";
import {AsyncPipe, NgIf, NgTemplateOutlet} from "@angular/common";
import {AutoRefreshComponent} from "@utility/presentation/component/auto-refresh/auto-refresh.component";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
	selector: 'customer-filter-component',
	standalone: true,
	imports: [
		FilterPanelComponent,
		SearchInputComponent,
		PrimaryButtonDirective,
		TranslateModule,
		IonSelectActiveComponent,
		DefaultPanelComponent,
		IonSelectWrapperComponent,
		AsyncPipe,
		NgIf,
		NgTemplateOutlet,
		AutoRefreshComponent,
		ReactiveFormsModule
	],
	template: `
		<utility-default-panel-component>
			<div *ngIf="isNotMobile$ | async" class="flex overflow-x-auto gap-2">
				<ng-container *ngTemplateOutlet="SearchInput"></ng-container>
				<ng-container *ngTemplateOutlet="CustomerActiveSelect"></ng-container>
				<ng-container *ngTemplateOutlet="AutoRefresh"></ng-container>
			</div>
			<div *ngIf="isMobile$ | async" class="flex gap-4 justify-between w-full">
				<ng-container *ngTemplateOutlet="SearchInput"></ng-container>
				<ng-container *ngTemplateOutlet="ButtonToOpenForm"></ng-container>
			</div>
			<div *ngIf="isNotMobile$ | async">
				<ng-container *ngTemplateOutlet="ButtonToOpenForm"></ng-container>
			</div>
		</utility-default-panel-component>
		<div *ngIf="isMobile$ | async" class="flex overflow-x-auto gap-2 my-2 px-2">
			<ng-container *ngTemplateOutlet="CustomerActiveSelect"></ng-container>
			<ng-container *ngTemplateOutlet="AutoRefresh"></ng-container>
		</div>

		<ng-template #CustomerActiveSelect>
			<ion-select-active
				class="px-4 py-3 border border-beeColor-300 rounded-2xl"
				[control]="form.controls.active"/>
		</ng-template>

		<ng-template #SearchInput>
			<utility-search-input-component [formControl]="form.controls.phrase"/>
		</ng-template>

		<ng-template #AutoRefresh>
			<utility-auto-refresh-component id="customer-filter-auto-refresh" (emitter)="forceRefresh()"/>
		</ng-template>

		<ng-template #ButtonToOpenForm>
			<button *ngIf="showButtonGoToForm" type="button" primary class="!py-3 !px-4 !text-base flex-1"
					(click)="openForm()">
				<i class="bi bi-plus-lg"></i>
<!--				<span class="hidden xl:block">-->
<!--					{{ 'customer.button.create' | translate }}-->
<!--				</span>-->
			</button>
		</ng-template>
	`
})
export class FilterComponent extends BaseFilterComponent {

	@Input()
	public showButtonGoToForm = true;

	public override readonly form = new FilterForm();
	public override readonly actions = CustomerActions;
	public override readonly state = CustomerState;

	constructor() {
		super();
		super.initHandlers();
	}

	public openForm() {
		this.store.dispatch(new CustomerActions.OpenForm());
	}
}
