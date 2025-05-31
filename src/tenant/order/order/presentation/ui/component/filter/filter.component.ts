import {Component, inject, input, OnInit} from '@angular/core';
import {SearchInputComponent} from '@shared/presentation/component/input/search.input.component';
import {FilterForm} from "@tenant/order/order/presentation/form/filter.form";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {BaseFilterComponent} from "@shared/base.filter.component";
import {DefaultPanelComponent} from "@shared/presentation/component/panel/default.panel.component";
import {IonSelectWrapperComponent} from "@shared/presentation/component/input/ion/ion-select-wrapper.component";
import {AsyncPipe, NgTemplateOutlet} from "@angular/common";
import {OrderActions} from "@tenant/order/order/infrastructure/state/order/order.actions";
import {OrderState} from "@tenant/order/order/infrastructure/state/order/order.state";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {OrderStatusEnum} from '@tenant/order/order/domain/enum/order.status.enum';
import {AutoRefreshComponent} from "@shared/presentation/component/auto-refresh/auto-refresh.component";
import {PrimaryButtonDirective} from "@shared/presentation/directives/button/primary.button.directive";

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
		AutoRefreshComponent,
		PrimaryButtonDirective
	],
	template: `
		<utility-default-panel-component>
			@if (isMobile$ | async) {
				<div class="flex gap-4 justify-between w-full p-2">
					<!--					TODO: return this feature when backend will ready for it -->
					<!--					<ng-container *ngTemplateOutlet="SearchInput"></ng-container>-->
					<ng-container *ngTemplateOutlet="ButtonToOpenForm"></ng-container>
					<!--					<ng-container *ngTemplateOutlet="AutoRefresh"></ng-container>-->

					<ng-container *ngTemplateOutlet="SelectOrderStatus"/>
				</div>
			} @else {
				<div class="flex overflow-x-auto justify-between w-full gap-2 p-2">
					<!--					TODO: return this feature when backend will ready for it -->
					<!--					<ng-container *ngTemplateOutlet="SearchInput"></ng-container>-->
					<ng-container *ngTemplateOutlet="SelectOrderStatus"/>
					<ng-container *ngTemplateOutlet="ButtonToOpenForm"></ng-container>
					<!--					<ng-container *ngTemplateOutlet="AutoRefresh"></ng-container>-->
				</div>
			}
		</utility-default-panel-component>
		<!--		@if (isMobile$ | async) {-->

		<!--			<div class="flex overflow-x-auto gap-2 my-2 px-2">-->
		<!--				<ng-container *ngTemplateOutlet="SelectOrderStatus"></ng-container>-->
		<!--			</div>-->
		<!--		}-->

		<ng-template #SearchInput>
			<utility-search-input-component [formControl]="form.controls.phrase"/>
		</ng-template>

		<ng-template #SelectOrderStatus>
			<ion-select-wrapper
				id="order-filter-select-order-status"
				[multiple]="true"
				[options]="orderStatusOptions"
				[control]="orderStatusControl()"/>
		</ng-template>
		<ng-template #AutoRefresh>
			<utility-auto-refresh-component id="order-filter-auto-refresh" (emitter)="forceRefresh()"/>
		</ng-template>

		<ng-template #ButtonToOpenForm>
			@if (showButtonGoToForm()) {
				<div>

					<button type="button" class="!py-3 !px-4 !text-base flex-1" primary
							(click)="openForm()">
						<i class="bi bi-plus-lg"></i>
						<!--                <span class="hidden xl:block">-->
						<!--					{{ 'absence.button.create' | translate }}-->
						<!--				</span>-->
					</button>
				</div>
			}
		</ng-template>
	`,
	host: {
		class: 'flex flex-col overflow-x-auto border-b'
	}
})
export class FilterComponent extends BaseFilterComponent implements OnInit {

	public readonly showButtonGoToForm = input(true);
	public readonly orderStatusControl = input.required<FormControl<OrderStatusEnum[]>>();

	public override readonly form = new FilterForm();
	public override readonly state = OrderState;

	private readonly translateService = inject(TranslateService);

	public orderStatusOptions: {
		value: any;
		label: string;
	}[] = [];

	private initOrderStatusList() {
		// Object.keys(OrderStatusEnum)
		[OrderStatusEnum.confirmed, OrderStatusEnum.done, OrderStatusEnum.cancelled].forEach((status) => {
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
		// this.orderStatusControl.valueChanges.pipe(this.takeUntil()).subscribe((statuses) => {
		// 	this.store.dispatch([
		// 		new OrderActions.UpdateFilters({statuses}),
		// 		new OrderActions.GetList()
		// 	]);
		// });
	}
}
