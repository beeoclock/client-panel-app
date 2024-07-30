import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {IonPopover} from "@ionic/angular/standalone";
import {NgSwitch, NgSwitchCase} from "@angular/common";
import {RIMember} from "@member/domain";
import {CustomerTypeEnum} from "@customer/domain/enum/customer-type.enum";
import {
	CustomerTypeCustomerComponent
} from "@customer/presentation/component/form/by-customer-type/customer-type.customer.component";
import {TranslateModule} from "@ngx-translate/core";
import {CustomerForm} from "@customer/presentation/form";
import ObjectID from "bson-objectid";
import {Reactive} from "@utility/cdk/reactive";
import {ICustomer} from "@customer/domain";

@Component({
	selector: 'app-customer-chip-component',
	standalone: true,
	styles: [
		`
			ion-popover {
				--width: auto;
			}
		`
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgSwitch,
		IonPopover,
		CustomerTypeCustomerComponent,
		TranslateModule,
		NgSwitchCase
	],
	template: `
		<button
			[id]="'customer-trigger-' + id"
			class="px-3 py-2 rounded-lg border border-gray-200 justify-center items-center flex">
			<div class="text-slate-900 text-sm font-normal">
				👤
				<ng-container [ngSwitch]="customerForm.value.customerType">
					<ng-container *ngSwitchCase="customerTypeEnum.unregistered">
						{{ customerForm.value.firstName }}
					</ng-container>
					<ng-container *ngSwitchCase="customerTypeEnum.regular">
						{{ customerForm.value.firstName }} 📇
					</ng-container>
					<ng-container *ngSwitchCase="customerTypeEnum.new">
						{{ customerForm.value.firstName }} 🆕
					</ng-container>
					<ng-container *ngSwitchCase="customerTypeEnum.anonymous">
						{{ 'keyword.capitalize.anonymous' | translate }}
					</ng-container>
				</ng-container>
			</div>

		</button>
		<ion-popover [trigger]="'customer-trigger-' + id" [keepContentsMounted]="true">
			<ng-template>
				<app-customer-type-customer-component class="p-4" [form]="customerForm" [showList]="true">
					<!--							<div class="font-bold" slot="label">{{ 'keyword.capitalize.payer' | translate }}</div>-->
					<div slot="banner" customer-type="new"
						 class="bg-beeColor-100 border-2 px-3 py-2 rounded-lg text-beeColor-600 text-sm flex flex-col">
						<div class="font-bold">
							<i class="bi bi-exclamation-triangle-fill"></i>
							{{ 'keyword.capitalize.warning' | translate }}
						</div>
						<div>
							{{ 'order.form.payment.payer.case.new.hint' | translate }}
						</div>
					</div>

					<div slot="banner" customer-type="unregistered"
						 class="bg-beeColor-100 border-2 px-3 py-2 rounded-lg text-beeColor-600 text-sm flex flex-col">
						<div class="font-bold">
							<i class="bi bi-exclamation-triangle-fill"></i>
							{{ 'keyword.capitalize.warning' | translate }}
						</div>
						<div>
							{{ 'order.form.payment.payer.case.unregistered.hint' | translate }}
						</div>
					</div>
				</app-customer-type-customer-component>
			</ng-template>
		</ion-popover>
	`
})
export class CustomerChipComponent extends Reactive implements OnInit {

	@Input()
	public initialValue: RIMember | undefined = undefined;

	@Input()
	public id: string = ObjectID().toHexString();

	@Output()
	public readonly customerChanges = new EventEmitter<ICustomer>();

	public readonly customerForm = CustomerForm.create({
		customerType: CustomerTypeEnum.anonymous
	});

	protected readonly customerTypeEnum = CustomerTypeEnum;

	public ngOnInit() {

		this.customerForm.valueChanges.pipe(this.takeUntil()).subscribe((value) => {
			console.log({value});
			this.customerChanges.emit(this.customerForm.getRawValue());
		});
	}
}
