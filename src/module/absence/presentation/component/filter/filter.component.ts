import {Component, Input} from '@angular/core';
import {FilterPanelComponent} from '@utility/presentation/component/panel/filter.panel.component';
import {SearchInputComponent} from '@utility/presentation/component/input/search.input.component';
import {FilterForm} from "@absence/presentation/form/filter.form";
import {AbsenceActions} from "@absence/state/absence/absence.actions";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {TranslateModule} from "@ngx-translate/core";
import {IonSelectActiveComponent} from "@utility/presentation/component/input/ion/ion-select-active.component";
import {AbsenceState} from "@absence/state/absence/absence.state";
import {BaseFilterComponent} from "@utility/base.filter.component";
import {DefaultPanelComponent} from "@utility/presentation/component/panel/default.panel.component";
import {IonSelectWrapperComponent} from "@utility/presentation/component/input/ion/ion-select-wrapper.component";
import {AsyncPipe, NgIf, NgTemplateOutlet} from "@angular/common";
import {AutoRefreshComponent} from "@utility/presentation/component/auto-refresh/auto-refresh.component";

@Component({
	selector: 'app-absence-filter-component',
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
		AutoRefreshComponent
	],
	template: `
        <utility-default-panel-component>
            <div *ngIf="isNotMobile$ | async" class="flex overflow-x-auto gap-4">
                <ng-container *ngTemplateOutlet="SearchInput"></ng-container>
                <ng-container *ngTemplateOutlet="AbsenceActiveSelect"></ng-container>
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
            <ng-container *ngTemplateOutlet="AbsenceActiveSelect"></ng-container>
            <ng-container *ngTemplateOutlet="AutoRefresh"></ng-container>
        </div>

        <ng-template #AbsenceActiveSelect>
            <ion-select-active
                    class="px-4 py-3 border border-beeColor-300 rounded-2xl"
                    [control]="form.controls.active"/>
        </ng-template>

        <ng-template #SearchInput>
            <utility-search-input-component [control]="form.controls.phrase"/>
        </ng-template>

        <ng-template #AutoRefresh>
            <utility-auto-refresh-component (emitter)="forceRefresh()"/>
        </ng-template>

        <ng-template #ButtonToOpenForm>
            <button *ngIf="showButtonGoToForm" type="button" class="!py-3 !px-4 !text-base" primary (click)="openForm()">
                <i class="bi bi-plus-lg"></i>
<!--                <span class="hidden xl:block">-->
<!--					{{ 'absence.button.create' | translate }}-->
<!--				</span>-->
            </button>
        </ng-template>
    `
})
export class FilterComponent extends BaseFilterComponent {

	@Input()
	public showButtonGoToForm = true;

	public override readonly form = new FilterForm();
	public override readonly actions = AbsenceActions;
	public override readonly state = AbsenceState;

	constructor() {
		super();
		super.initHandlers();
	}

	public openForm() {
		this.store.dispatch(new AbsenceActions.OpenForm());
	}
}
