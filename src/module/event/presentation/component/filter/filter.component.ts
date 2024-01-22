import {Component} from '@angular/core';
import {FilterPanelComponent} from '@utility/presentation/component/panel/filter.panel.component';
import {SearchInputComponent} from '@utility/presentation/component/input/search.input.component';
import {FilterForm} from "@event/presentation/form/filter.form";
import {EventActions} from "@event/state/event/event.actions";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {RouterLink} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {
	IonSelectEventStatusComponent
} from "@utility/presentation/component/input/ion/ion-select-event-status.component";
import {EventState} from "@event/state/event/event.state";
import {BaseFilterComponent} from "@utility/base.filter.component";
import {IonSelectActiveComponent} from "@utility/presentation/component/input/ion/ion-select-active.component";
import {DefaultPanelComponent} from "@utility/presentation/component/panel/default.panel.component";
import {AsyncPipe, NgIf, NgTemplateOutlet} from "@angular/common";
import {AutoRefreshComponent} from "@utility/presentation/component/auto-refresh/auto-refresh.component";
import {EventStatusEnum} from "@utility/domain/enum/event-status.enum";

@Component({
	selector: 'event-filter-component',
	standalone: true,
	imports: [
		FilterPanelComponent,
		SearchInputComponent,
		PrimaryButtonDirective,
		RouterLink,
		TranslateModule,
		IonSelectEventStatusComponent,
		IonSelectActiveComponent,
		DefaultPanelComponent,
		AsyncPipe,
		NgIf,
		NgTemplateOutlet,
		AutoRefreshComponent
	],
	template: `
		<utility-default-panel-component>
			<div *ngIf="isNotMobile$ | async" class="flex overflow-x-auto gap-4">
				<ng-container *ngTemplateOutlet="SearchInput"></ng-container>
				<ng-container *ngTemplateOutlet="EventStatusSelect"></ng-container>
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
			<ng-container *ngTemplateOutlet="EventStatusSelect"></ng-container>
			<ng-container *ngTemplateOutlet="AutoRefresh"></ng-container>
		</div>

		<ng-template #EventStatusSelect>
			<ion-select-event-status
				class="px-4 py-2 border border-beeColor-200 rounded-2xl"
				[ignoreStatusList]="ignoreStatusList"
				[addAllOption]="false"
				[control]="form.controls.status"/>
		</ng-template>

		<ng-template #SearchInput>
			<utility-search-input-component [control]="form.controls.phrase"/>
		</ng-template>

		<ng-template #AutoRefresh>
			<utility-auto-refresh-component (emitter)="forceRefresh()"/>
		</ng-template>

		<ng-template #ButtonToOpenForm>
			<button type="button" primary routerLink="../form">
				<i class="bi bi-plus-lg"></i>
				<span class="hidden xl:block">
						{{ 'keyword.capitalize.add-event' | translate }}
					</span>
			</button>
		</ng-template>
	`
})
export class FilterComponent extends BaseFilterComponent {

	public override readonly form = new FilterForm();
	public override readonly actions = EventActions;
	public override readonly state = EventState;
	public readonly ignoreStatusList = [EventStatusEnum.requested, EventStatusEnum.rejected];

	constructor() {
		super();
		super.initHandlers();
	}
}
