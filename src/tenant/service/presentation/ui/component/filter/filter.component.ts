import {Component, input, OnInit} from '@angular/core';
import {SearchInputComponent} from '@shared/presentation/component/input/search.input.component';
import {FilterForm} from "@tenant/service/presentation/form/filter.form";
import {ServiceActions} from "@tenant/service/infrastructure/state/service/service.actions";
import {TranslateModule} from "@ngx-translate/core";
import {PrimaryButtonDirective} from "@shared/presentation/directives/button/primary.button.directive";
import {ServiceState} from "@tenant/service/infrastructure/state/service/service.state";
import {BaseFilterComponent} from "@shared/base.filter.component";
import {DefaultPanelComponent} from "@shared/presentation/component/panel/default.panel.component";
import {AsyncPipe, NgTemplateOutlet} from "@angular/common";
import {
	AutoRefreshButtonComponent
} from "@tenant/service/presentation/ui/component/button/auto-refresh/auto-refresh.button.component";
import {ReactiveFormsModule} from "@angular/forms";
import {IonSelectStateComponent} from "@shared/presentation/component/input/ion/ion-select-state.component";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";

@Component({
	selector: 'service-filter-component',
	standalone: true,
	imports: [
		SearchInputComponent,
		TranslateModule,
		PrimaryButtonDirective,
		DefaultPanelComponent,
		AsyncPipe,
		NgTemplateOutlet,
		AutoRefreshButtonComponent,
		ReactiveFormsModule,
		IonSelectStateComponent
	],
	template: `
		<utility-default-panel-component>
			@if (isMobile$ | async) {
				<div class="flex gap-4 justify-between w-full p-2">
					<ng-container *ngTemplateOutlet="SearchInput"/>
					<ng-container *ngTemplateOutlet="ButtonToOpenForm"/>
				</div>
			} @else {

				<div class="flex overflow-x-auto gap-2 p-2">
					<ng-container *ngTemplateOutlet="SearchInput"/>
					<ng-container *ngTemplateOutlet="ServiceActiveSelect"/>
					<service-auto-refresh-component/>
				</div>
				<div class="p-2">
					<ng-container *ngTemplateOutlet="ButtonToOpenForm"/>
				</div>
			}
		</utility-default-panel-component>
		@if (isMobile$ | async) {
			<div class="flex overflow-x-auto gap-2 my-2 px-2">
				<ng-container *ngTemplateOutlet="ServiceActiveSelect"/>
				<service-auto-refresh-component/>
			</div>
		}

		<ng-template #ServiceActiveSelect>
			<ion-select-state
				[control]="form.controls.state"/>
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
	public override readonly state = ServiceState;

	public ngOnInit() {
		super.initHandlers();
	}

	@Dispatch()
	public openForm() {
		return new ServiceActions.OpenForm();
	}
}
