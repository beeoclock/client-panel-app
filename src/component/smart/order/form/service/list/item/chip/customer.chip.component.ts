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
		IonPopover,
		CustomerTypeCustomerComponent,
		TranslateModule,
		CustomerListIonicComponent
	],
	template: `
		<button
			[id]="'customer-trigger-' + id"
			class="px-3 py-2 rounded-lg border border-gray-200 justify-center items-center flex">
			<div class="text-slate-900 text-sm font-normal">
				👤
				@switch (customerForm.value.customerType) {
					@case (customerTypeEnum.unregistered) {
						{{ customerForm.value.firstName }}
					}
					@case (customerTypeEnum.regular) {
						{{ customerForm.value.firstName }} 📇
					}
					@case (customerTypeEnum.new) {
						{{ customerForm.value.firstName }} 🆕
					}
					@case (customerTypeEnum.anonymous) {
						{{ 'keyword.capitalize.anonymous' | translate }}
					}
				}
			</div>

		</button>
		<ion-popover #customerPopover
					 [trigger]="'customer-trigger-' + id"
					 [keepContentsMounted]="true">
			<ng-template>
				<app-customer-list-ionic-component
					[id]="'customer-list-ionic-' + id"
					[customerForm]="customerForm"
					(doDone)="doDone($event)"/>
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
