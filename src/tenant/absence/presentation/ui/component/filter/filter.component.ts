import {Component, input} from '@angular/core';
import {SearchInputComponent} from '@shared/presentation/component/input/search.input.component';
import {FilterForm} from "@tenant/absence/presentation/form/filter.form";
import {PrimaryButtonDirective} from "@shared/presentation/directives/button/primary.button.directive";
import {TranslateModule} from "@ngx-translate/core";
import {BaseFilterComponent} from "@shared/base.filter.component";
import {DefaultPanelComponent} from "@shared/presentation/component/panel/default.panel.component";
import {AsyncPipe, NgTemplateOutlet} from "@angular/common";
import {AutoRefreshComponent} from "@shared/presentation/component/auto-refresh/auto-refresh.component";
import {ReactiveFormsModule} from "@angular/forms";
import {IonSelectStateComponent} from "@shared/presentation/component/input/ion/ion-select-state.component";
import {AbsenceDataState} from "@tenant/absence/infrastructure/state/data/absence.data.state";
import {
	AbsencePresentationActions
} from "@tenant/absence/infrastructure/state/presentation/absence.presentation.actions";

@Component({
	selector: 'app-absence-filter-component',
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

				<div class="flex gap-4 justify-between w-full">
					<ng-container *ngTemplateOutlet="SearchInput"/>
					<ng-container *ngTemplateOutlet="ButtonToOpenForm"/>
				</div>
			} @else {

				<div class="flex overflow-x-auto gap-2">
					<ng-container *ngTemplateOutlet="SearchInput"/>
					<ng-container *ngTemplateOutlet="AbsenceActiveSelect"/>
					<ng-container *ngTemplateOutlet="AutoRefresh"/>
				</div>
				<div>
					<ng-container *ngTemplateOutlet="ButtonToOpenForm"/>
				</div>
			}
		</utility-default-panel-component>
		@if (isMobile$ | async) {
			<div class="flex overflow-x-auto gap-2 my-2 px-2">
				<ng-container *ngTemplateOutlet="AbsenceActiveSelect"/>
				<ng-container *ngTemplateOutlet="AutoRefresh"/>
			</div>
		}

		<ng-template #AbsenceActiveSelect>
			<ion-select-state
				[control]="form.controls.state"/>
		</ng-template>

		<ng-template #SearchInput>
			<utility-search-input-component [formControl]="form.controls.phrase"/>
		</ng-template>

		<ng-template #AutoRefresh>
			<utility-auto-refresh-component id="absence-filter-auto-refresh" (emitter)="forceRefresh()"/>
		</ng-template>

		<ng-template #ButtonToOpenForm>
			@if (showButtonGoToForm()) {
				<button type="button" class="!py-3 !px-4 !text-base flex-1" primary
						(click)="openForm()">
					<i class="bi bi-plus-lg"></i>
					<!--                <span class="hidden xl:block">-->
					<!--					{{ 'absence.button.create' | translate }}-->
					<!--				</span>-->
				</button>
			}
		</ng-template>
	`
})
export class FilterComponent extends BaseFilterComponent {

	public readonly showButtonGoToForm = input(true);

	public override readonly form = new FilterForm();
	public override readonly state = AbsenceDataState;

	constructor() {
		super();
		super.initHandlers();
	}

	public openForm() {
		this.store.dispatch(new AbsencePresentationActions.OpenForm());
	}
}
