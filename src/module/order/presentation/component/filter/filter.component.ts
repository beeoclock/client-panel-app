import {Component, Input} from '@angular/core';
import {FilterPanelComponent} from '@utility/presentation/component/panel/filter.panel.component';
import {SearchInputComponent} from '@utility/presentation/component/input/search.input.component';
import {FilterForm} from "@order/presentation/form/filter.form";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {TranslateModule} from "@ngx-translate/core";
import {IonSelectActiveComponent} from "@utility/presentation/component/input/ion/ion-select-active.component";
import {BaseFilterComponent} from "@utility/base.filter.component";
import {DefaultPanelComponent} from "@utility/presentation/component/panel/default.panel.component";
import {
    IonSelectEventStatusComponent
} from "@utility/presentation/component/input/ion/ion-select-event-status.component";
import {AsyncPipe, NgIf, NgTemplateOutlet} from "@angular/common";
import {AutoRefreshComponent} from "@utility/presentation/component/auto-refresh/auto-refresh.component";
import {OrderActions} from "@order/state/order/order.actions";
import {OrderState} from "@order/state/order/order.state";

@Component({
    selector: 'app-order-filter-component',
    standalone: true,
    imports: [
        FilterPanelComponent,
        SearchInputComponent,
        PrimaryButtonDirective,
        TranslateModule,
        IonSelectActiveComponent,
        DefaultPanelComponent,
        IonSelectEventStatusComponent,
        AsyncPipe,
        NgIf,
        NgTemplateOutlet,
        AutoRefreshComponent
    ],
    template: `
        <utility-default-panel-component>
            <div *ngIf="isNotMobile$ | async" class="flex overflow-x-auto gap-4">
                <ng-container *ngTemplateOutlet="SearchInput"></ng-container>
                <ng-container *ngTemplateOutlet="OrderActiveSelect"></ng-container>
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
            <ng-container *ngTemplateOutlet="OrderActiveSelect"></ng-container>
            <ng-container *ngTemplateOutlet="AutoRefresh"></ng-container>
        </div>

        <ng-template #OrderActiveSelect>
            <ion-select-active
                    class="px-4 py-2 border border-beeColor-200 rounded-2xl"
                    [control]="form.controls.active"/>
        </ng-template>

        <ng-template #SearchInput>
            <utility-search-input-component [control]="form.controls.phrase"/>
        </ng-template>

        <ng-template #AutoRefresh>
            <utility-auto-refresh-component (emitter)="forceRefresh()"/>
        </ng-template>

        <ng-template #ButtonToOpenForm>
            <button *ngIf="showButtonGoToForm" type="button" primary (click)="openForm()">
                <i class="bi bi-plus-lg"></i>
                <span class="hidden xl:block">
					{{ 'order.button.create' | translate }}
				</span>
            </button>
        </ng-template>
    `
})
export class FilterComponent extends BaseFilterComponent {

    @Input()
    public showButtonGoToForm = true;

    public override readonly form = new FilterForm();
    public override readonly actions = OrderActions;
    public override readonly state = OrderState;

    constructor() {
        super();
        super.initHandlers();
    }

    public openForm() {
        this.store.dispatch(new OrderActions.OpenForm());
    }
}
