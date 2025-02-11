import {Component, input} from '@angular/core';
import {SearchInputComponent} from '@utility/presentation/component/input/search.input.component';
import {FilterForm} from "@service/presentation/form/filter.form";
import {ServiceActions} from "@service/state/service/service.actions";
import {TranslateModule} from "@ngx-translate/core";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {IonSelectActiveComponent} from "@utility/presentation/component/input/ion/ion-select-active.component";
import {ServiceState} from "@service/state/service/service.state";
import {BaseFilterComponent} from "@utility/base.filter.component";
import {DefaultPanelComponent} from "@utility/presentation/component/panel/default.panel.component";
import {AsyncPipe, NgTemplateOutlet} from "@angular/common";
import {
	AutoRefreshButtonComponent
} from "@service/presentation/component/button/auto-refresh/auto-refresh.button.component";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
	selector: 'service-filter-component',
	standalone: true,
	imports: [
		SearchInputComponent,
		TranslateModule,
		PrimaryButtonDirective,
		IonSelectActiveComponent,
		DefaultPanelComponent,
		AsyncPipe,
		NgTemplateOutlet,
		AutoRefreshButtonComponent,
		ReactiveFormsModule
	],
	template: `
		<utility-default-panel-component>
			@if (isMobile$ | async) {
				<div class="flex gap-4 justify-between w-full">
					<ng-container *ngTemplateOutlet="SearchInput"></ng-container>
					<ng-container *ngTemplateOutlet="ButtonToOpenForm"></ng-container>
				</div>
			} @else {

				<div class="flex overflow-x-auto gap-2">
					<ng-container *ngTemplateOutlet="SearchInput"></ng-container>
					<ng-container *ngTemplateOutlet="ServiceActiveSelect"></ng-container>
					<service-auto-refresh-component/>
				</div>
				<div>
					<ng-container *ngTemplateOutlet="ButtonToOpenForm"></ng-container>
				</div>
			}
		</utility-default-panel-component>
		@if (isMobile$ | async) {
			<div  class="flex overflow-x-auto gap-2 my-2 px-2">
				<ng-container *ngTemplateOutlet="ServiceActiveSelect"></ng-container>
				<service-auto-refresh-component [resetPage]="true"/>
			</div>
		}

		<ng-template #ServiceActiveSelect>
			<ion-select-active
				[control]="form.controls.active"/>
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
export class FilterComponent extends BaseFilterComponent {

	public readonly showButtonGoToForm = input(true);

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
