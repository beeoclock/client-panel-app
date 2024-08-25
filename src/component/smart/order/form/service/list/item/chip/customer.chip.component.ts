import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
	Input,
	OnInit,
	output,
	ViewChild
} from "@angular/core";
import {IonPopover} from "@ionic/angular/standalone";
import {NgSwitch, NgSwitchCase} from "@angular/common";
import {CustomerTypeEnum} from "@customer/domain/enum/customer-type.enum";
import {
	CustomerTypeCustomerComponent
} from "@customer/presentation/component/form/by-customer-type/customer-type.customer.component";
import {TranslateModule} from "@ngx-translate/core";
import {CustomerForm} from "@customer/presentation/form";
import ObjectID from "bson-objectid";
import {Reactive} from "@utility/cdk/reactive";
import {ICustomer} from "@customer/domain";
import {
	CustomerListIonicComponent
} from "@src/component/smart/order/form/service/list/item/chip/customer/customer.list.ionic.component";

@Component({
	selector: 'app-customer-chip-component',
	standalone: true,
	styles: [
		`
			ion-popover {
				--width: auto;
				--max-height: 400px
			}
		`
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgSwitch,
		IonPopover,
		CustomerTypeCustomerComponent,
		TranslateModule,
		NgSwitchCase,
		CustomerListIonicComponent
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
		<ion-popover #customerPopover
					 [trigger]="'customer-trigger-' + id"
					 [keepContentsMounted]="true"
					 [backdropDismiss]="false">
			<ng-template>
				<app-customer-list-ionic-component [customerForm]="customerForm" (doDone)="doDone($event)"/>
			</ng-template>
		</ion-popover>
	`
})
export class CustomerChipComponent extends Reactive implements OnInit {

	@Input()
	public initialValue: ICustomer | undefined;

	@Input()
	public id: string = ObjectID().toHexString();

	public readonly customerChanges = output<ICustomer>();

	@ViewChild('customerPopover')
	public readonly customerPopover!: IonPopover;

	readonly #changeDetectorRef = inject(ChangeDetectorRef);

	public readonly customerForm = CustomerForm.create({
		customerType: CustomerTypeEnum.anonymous
	});

	public ngOnInit() {
		if (this.initialValue) {
			this.customerForm.patchValue(this.initialValue);
			this.#changeDetectorRef.detectChanges();
		}
	}

	protected readonly customerTypeEnum = CustomerTypeEnum;

	protected doDone(save: boolean = true) {
		if (this.customerForm.valid) {
			if (save) {
				const rawValue = this.customerForm.getRawValue();
				this.customerChanges.emit(rawValue);
			}
			this.customerPopover.dismiss().then();
		}
	}
}
