import {Component, HostBinding, inject, input, OnInit} from '@angular/core';
import {SearchInputComponent} from '@utility/presentation/component/input/search.input.component';
import {FilterForm} from "@order/presentation/form/filter.form";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {BaseFilterComponent} from "@utility/base.filter.component";
import {DefaultPanelComponent} from "@utility/presentation/component/panel/default.panel.component";
import {IonSelectWrapperComponent} from "@utility/presentation/component/input/ion/ion-select-wrapper.component";
import {AsyncPipe, NgTemplateOutlet} from "@angular/common";
import {OrderActions} from "@order/state/order/order.actions";
import {OrderState} from "@order/state/order/order.state";
import {OrderServiceStatusEnum} from "@order/domain/enum/order-service.status.enum";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {OrderStatusEnum} from '@order/domain/enum/order.status.enum';
import {AutoRefreshComponent} from "@utility/presentation/component/auto-refresh/auto-refresh.component";

@Component({
	selector: 'app-order-filter-component',
	standalone: true,
	imports: [
		SearchInputComponent,
		TranslateModule,
		DefaultPanelComponent,
		IonSelectWrapperComponent,
		AsyncPipe,
		NgTemplateOutlet,
		ReactiveFormsModule,
		AutoRefreshComponent
	],
	template: `
		<utility-default-panel-component>
			@if (isMobile$ | async) {
				<div class="flex gap-4 justify-between w-full">
					<!--					TODO: return this feature when backend will ready for it -->
<!--					<ng-container *ngTemplateOutlet="SearchInput"></ng-container>-->
					<!--				<ng-container *ngTemplateOutlet="ButtonToOpenForm"></ng-container>-->
					<ng-container *ngTemplateOutlet="AutoRefresh"></ng-container>
				</div>
			} @else {
				<div class="flex overflow-x-auto gap-2">
					<!--					TODO: return this feature when backend will ready for it -->
<!--					<ng-container *ngTemplateOutlet="SearchInput"></ng-container>-->
					<ng-container *ngTemplateOutlet="SelectOrderStatus"></ng-container>
					<ng-container *ngTemplateOutlet="AutoRefresh"></ng-container>
				</div>
			}
		</utility-default-panel-component>
		@if (isMobile$ | async) {

			<div class="flex overflow-x-auto gap-2 my-2 px-2">
				<ng-container *ngTemplateOutlet="SelectOrderStatus"></ng-container>
			</div>
		}

		<ng-template #SearchInput>
			<utility-search-input-component [formControl]="form.controls.phrase"/>
		</ng-template>

		<ng-template #SelectOrderStatus>
			<ion-select-wrapper
				id="order-filter-select-order-status"
				[multiple]="true"
				[options]="orderStatusOptions"
				[control]="orderStatusControl"/>
		</ng-template>
		<ng-template #AutoRefresh>
			<utility-auto-refresh-component id="order-filter-auto-refresh" (emitter)="forceRefresh()"/>
		</ng-template>
	`
})
export class FilterComponent extends BaseFilterComponent implements OnInit {

	public readonly showButtonGoToForm = input(true);

	@HostBinding()
	public class = 'flex flex-col overflow-x-auto';

	public override readonly form = new FilterForm();
	public override readonly actions = OrderActions;
	public override readonly state = OrderState;

	public readonly orderStatusControl = new FormControl<OrderServiceStatusEnum[]>([], {
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
		this.orderStatusControl.valueChanges.pipe(this.takeUntil()).subscribe((statuses) => {
			this.store.dispatch([
				new OrderActions.UpdateFilters({statuses}),
				new OrderActions.GetList()
			]);
		});
	}
}
