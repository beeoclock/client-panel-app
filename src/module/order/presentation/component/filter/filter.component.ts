import {Component, HostBinding, inject, input, OnInit} from '@angular/core';
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
import {OrderActions} from "@order/state/order/order.actions";
import {OrderState} from "@order/state/order/order.state";
import {OrderServiceStatusEnum} from "@order/domain/enum/order-service.status.enum";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
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
		ReactiveFormsModule
	],
	template: `
		<utility-default-panel-component>
			<div *ngIf="isNotMobile$ | async" class="flex overflow-x-auto gap-2">
				<ng-container *ngTemplateOutlet="SearchInput"></ng-container>
				<ng-container *ngTemplateOutlet="SelectOrderStatus"></ng-container>
			</div>
			<div *ngIf="isMobile$ | async" class="flex gap-4 justify-between w-full">
				<ng-container *ngTemplateOutlet="SearchInput"></ng-container>
<!--				<ng-container *ngTemplateOutlet="ButtonToOpenForm"></ng-container>-->
			</div>
<!--			<div *ngIf="isNotMobile$ | async">-->
<!--				<ng-container *ngTemplateOutlet="ButtonToOpenForm"></ng-container>-->
<!--			</div>-->
		</utility-default-panel-component>
		<div *ngIf="isMobile$ | async" class="flex overflow-x-auto gap-2 my-2 px-2">
			<ng-container *ngTemplateOutlet="SelectOrderStatus"></ng-container>
		</div>

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

<!--		<ng-template #ButtonToOpenForm>-->
<!--			<button *ngIf="showButtonGoToForm" type="button" class="!py-3 !px-4 !text-base" primary-->
<!--					(click)="openForm()">-->
<!--				<i class="bi bi-plus-lg"></i>-->
<!--				&lt;!&ndash;				<div class="hidden xl:block">&ndash;&gt;-->
<!--				&lt;!&ndash;					{{ 'order.button.create' | translate }}&ndash;&gt;-->
<!--				&lt;!&ndash;				</div>&ndash;&gt;-->
<!--			</button>-->
<!--		</ng-template>-->
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
