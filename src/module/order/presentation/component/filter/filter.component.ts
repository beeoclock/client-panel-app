import {Component, inject, Input, OnInit} from '@angular/core';
import {FilterPanelComponent} from '@utility/presentation/component/panel/filter.panel.component';
import {SearchInputComponent} from '@utility/presentation/component/input/search.input.component';
import {FilterForm} from "@order/presentation/form/filter.form";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {IonSelectActiveComponent} from "@utility/presentation/component/input/ion/ion-select-active.component";
import {BaseFilterComponent} from "@utility/base.filter.component";
import {DefaultPanelComponent} from "@utility/presentation/component/panel/default.panel.component";
import {IonSelectWrapperComponent} from "@utility/presentation/component/input/ion/ion-select-wrapper.component";
import {AsyncPipe, NgIf, NgTemplateOutlet} from "@angular/common";
import {AutoRefreshComponent} from "@utility/presentation/component/auto-refresh/auto-refresh.component";
import {OrderActions} from "@order/state/order/order.actions";
import {OrderState} from "@order/state/order/order.state";
import {OrderServiceStatusEnum} from "@order/domain/enum/order-service.status.enum";
import {FormControl} from "@angular/forms";
import {OrderStatusEnum} from '@src/module/order/domain/enum/order.status.enum';

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
				<ng-container *ngTemplateOutlet="AutoRefresh"></ng-container>
				<ng-container *ngTemplateOutlet="SelectOrderStatus"></ng-container>
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
			<ng-container *ngTemplateOutlet="AutoRefresh"></ng-container>
			<ng-container *ngTemplateOutlet="SelectOrderStatus"></ng-container>
		</div>

		<ng-template #SearchInput>
			<utility-search-input-component [control]="form.controls.phrase"/>
		</ng-template>

		<ng-template #AutoRefresh>
			<utility-auto-refresh-component (emitter)="forceRefresh()"/>
		</ng-template>

		<ng-template #SelectOrderStatus>
			<ion-select-wrapper
				id="order-filter-select-order-status"
				class="py-3"
				[options]="orderStatusOptions"
				[control]="orderStatusControl"/>
		</ng-template>

		<ng-template #ButtonToOpenForm>
			<button *ngIf="showButtonGoToForm" type="button" class="!py-3 !px-4 !text-base" primary (click)="openForm()">
				<i class="bi bi-plus-lg"></i>
				<div class="hidden xl:block">
					{{ 'order.button.create' | translate }}
				</div>
			</button>
		</ng-template>
	`
})
export class FilterComponent extends BaseFilterComponent implements OnInit {

	@Input()
	public showButtonGoToForm = true;

	public override readonly form = new FilterForm();
	public override readonly actions = OrderActions;
	public override readonly state = OrderState;

	public readonly orderStatusControl = new FormControl<OrderServiceStatusEnum | ''>('', {
		nonNullable: true
	});

	private readonly translateService = inject(TranslateService);

	public orderStatusOptions: {
		value: any;
		label: string;
	}[] = [];

	private initOrderStatusList() {
		Object.keys(OrderStatusEnum).forEach((status) => {
			this.orderStatusOptions.push({
				value: status,
				label: this.translateService.instant(`order.enum.status.singular.${status}`)
			});
		});
	}

	constructor() {
		super();
		super.initHandlers();
	}

	public openForm() {
		this.store.dispatch(new OrderActions.OpenForm());
	}

	public ngOnInit() {
		this.initOrderStatusList();
		this.orderStatusControl.valueChanges.pipe(this.takeUntil()).subscribe((status: string) => {
			this.store.dispatch([
				new OrderActions.UpdateFilters({status}),
				new OrderActions.GetList()
			]);
		});
	}
}
