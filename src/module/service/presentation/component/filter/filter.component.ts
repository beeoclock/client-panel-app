import {Component, Input} from '@angular/core';
import {FilterPanelComponent} from '@utility/presentation/component/panel/filter.panel.component';
import {SearchInputComponent} from '@utility/presentation/component/input/search.input.component';
import {FilterForm} from "@service/presentation/form/filter.form";
import {ServiceActions} from "@service/state/service/service.actions";
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {IonSelectActiveComponent} from "@utility/presentation/component/input/ion/ion-select-active.component";
import {ServiceState} from "@service/state/service/service.state";
import {BaseFilterComponent} from "@utility/base.filter.component";
import {IonSelectWrapperComponent} from "@utility/presentation/component/input/ion/ion-select-wrapper.component";
import {DefaultPanelComponent} from "@utility/presentation/component/panel/default.panel.component";
import {AsyncPipe, NgIf, NgTemplateOutlet} from "@angular/common";
import {
	AutoRefreshButtonComponent
} from "@service/presentation/component/button/auto-refresh/auto-refresh.button.component";
import {IconComponent} from "@src/component/adapter/icon/icon.component";

@Component({
	selector: 'service-filter-component',
	standalone: true,
	imports: [
		FilterPanelComponent,
		SearchInputComponent,
		TranslateModule,
		RouterLink,
		PrimaryButtonDirective,
		IonSelectActiveComponent,
		IonSelectWrapperComponent,
		DefaultPanelComponent,
		AsyncPipe,
		NgIf,
		NgTemplateOutlet,
		AutoRefreshButtonComponent,
		IconComponent
	],
	template: `
		<utility-default-panel-component>
			<div *ngIf="isNotMobile$ | async" class="flex overflow-x-auto gap-2">
				<ng-container *ngTemplateOutlet="SearchInput"></ng-container>
				<ng-container *ngTemplateOutlet="ServiceActiveSelect"></ng-container>
				<service-auto-refresh-component/>
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
			<ng-container *ngTemplateOutlet="ServiceActiveSelect"></ng-container>
			<service-auto-refresh-component [resetPage]="true"/>
		</div>

		<ng-template #ServiceActiveSelect>
			<ion-select-active
				class="px-4 py-3 border border-beeColor-300 rounded-2xl"
				[control]="form.controls.active"/>
		</ng-template>

		<ng-template #SearchInput>
			<utility-search-input-component
				[control]="form.controls.phrase"/>
		</ng-template>

		<ng-template #ButtonToOpenForm>
			<button *ngIf="showButtonGoToForm" type="button" class="!py-3 !px-4 !text-base" primary (click)="openForm()">
				<app-icon name="bootstrapPlusLg"/>
<!--				<span class="hidden xl:block">-->
<!--					{{ 'keyword.capitalize.add-service' | translate }}-->
<!--				</span>-->
			</button>
		</ng-template>
	`
})
export class FilterComponent extends BaseFilterComponent {

	@Input()
	public showButtonGoToForm = true;

	public override readonly form = new FilterForm();
	public override readonly actions = ServiceActions;
	public override readonly state = ServiceState;

	constructor() {
		super();
		super.initHandlers();
	}

	public openForm(): void {
		this.store.dispatch(new ServiceActions.OpenForm());
	}
}
