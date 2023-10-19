import {Component} from '@angular/core';
import {FilterPanelComponent} from '@utility/presentation/component/panel/filter.panel.component';
import {SearchInputComponent} from '@utility/presentation/component/input/search.input.component';
import {FilterForm} from "@customer/presentation/form/filter.form";
import {CustomerActions} from "@customer/state/customer/customer.actions";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {IonSelectActiveComponent} from "@utility/presentation/component/input/ion/ion-select-active.component";
import {CustomerState} from "@customer/state/customer/customer.state";
import {BaseFilterComponent} from "@utility/base.filter.component";
import {DefaultPanelComponent} from "@utility/presentation/component/panel/default.panel.component";
import {
	IonSelectEventStatusComponent
} from "@utility/presentation/component/input/ion/ion-select-event-status.component";
import {AsyncPipe, NgIf, NgTemplateOutlet} from "@angular/common";

@Component({
	selector: 'customer-filter-component',
	standalone: true,
	imports: [
		FilterPanelComponent,
		SearchInputComponent,
		PrimaryButtonDirective,
		TranslateModule,
		RouterLink,
		IonSelectActiveComponent,
		DefaultPanelComponent,
		IonSelectEventStatusComponent,
		AsyncPipe,
		NgIf,
		NgTemplateOutlet
	],
	template: `
		<utility-default-panel-component>
			<div *ngIf="isNotMobile$ | async" class="flex overflow-x-auto gap-4">
				<ng-container *ngTemplateOutlet="SearchInput"></ng-container>
				<ng-container *ngTemplateOutlet="CustomerActiveSelect"></ng-container>
			</div>
			<div *ngIf="isMobile$ | async" class="flex gap-4 justify-between w-full">
				<ng-container *ngTemplateOutlet="SearchInput"></ng-container>
				<ng-container *ngTemplateOutlet="ButtonToOpenForm"></ng-container>
			</div>
			<div *ngIf="isNotMobile$ | async">
				<ng-container *ngTemplateOutlet="ButtonToOpenForm"></ng-container>
			</div>
		</utility-default-panel-component>
		<div *ngIf="isMobile$ | async" class="flex overflow-x-auto gap-4 mt-4 px-4">
			<ng-container *ngTemplateOutlet="CustomerActiveSelect"></ng-container>
		</div>

		<ng-template #CustomerActiveSelect>
			<ion-select-active
				class="px-4 py-2 border border-beeColor-200 rounded-2xl"
				[control]="form.controls.active"/>
		</ng-template>

		<ng-template #SearchInput>
			<utility-search-input-component [control]="form.controls.phrase"/>
		</ng-template>

		<ng-template #ButtonToOpenForm>
			<button type="button" primary routerLink="form">
				<i class="bi bi-plus-lg"></i>
				<span class="hidden xl:block">
					{{ 'customer.button.create' | translate }}
				</span>
			</button>
		</ng-template>
	`
})
export class FilterComponent extends BaseFilterComponent {
	public readonly form = new FilterForm();

	constructor() {
		super();
		super.initHandlers(CustomerState, CustomerActions, this.form);
	}
}
