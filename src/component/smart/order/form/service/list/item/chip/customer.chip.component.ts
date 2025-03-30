import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
	input,
	OnInit,
	output,
	viewChild
} from "@angular/core";
import {IonPopover} from "@ionic/angular/standalone";
import {CustomerTypeEnum} from "@src/core/business-logic/customer/enum/customer-type.enum";
import {TranslateModule} from "@ngx-translate/core";
import {CustomerForm} from "@tenant/customer/presentation/form";
import ObjectID from "bson-objectid";
import {Reactive} from "@utility/cdk/reactive";
import {ICustomer} from "@src/core/business-logic/customer";
import {
	CustomerListIonicComponent
} from "@src/component/smart/order/form/service/list/item/chip/customer/customer.list.ionic.component";
import ECustomer from "@core/business-logic/customer/entity/e.customer";

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
		TranslateModule,
		CustomerListIonicComponent
	],
	template: `
		<button
			[id]="'customer-trigger-' + id()"
			class="px-3 py-2 rounded-xl border border-gray-200 justify-center items-center flex w-full">
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
					 [trigger]="'customer-trigger-' + id()"
					 [keepContentsMounted]="true">
			<ng-template>
				<app-customer-list-ionic-component
					[id]="'customer-list-ionic-' + id()"
					[customerForm]="customerForm"
					(doDone)="doDone($event)"/>
			</ng-template>
		</ion-popover>
	`
})
export class CustomerChipComponent extends Reactive implements OnInit {

	public readonly initialValue = input<ICustomer.DTO>();

	public readonly id = input<string>(ObjectID().toHexString());

	public readonly customerChanges = output<ICustomer.DTO>();

	readonly customerPopover = viewChild.required<IonPopover>('customerPopover');

	readonly #changeDetectorRef = inject(ChangeDetectorRef);

	public readonly customerForm = CustomerForm.create({
		customerType: CustomerTypeEnum.anonymous
	});

	public ngOnInit() {
		const initialValue = this.initialValue();
		if (initialValue) {
			this.customerForm.patchValue(initialValue);
			this.#changeDetectorRef.detectChanges();
		}
	}

	protected readonly customerTypeEnum = CustomerTypeEnum;

	protected doDone(save: boolean = true) {
		if (this.customerForm.valid) {
			this.customerPopover().dismiss().then();
			if (save) {
				const existCustomer = this.initialValue();
				const rawValue = this.customerForm.getRawValue();
				if (existCustomer) {
					if (ECustomer.isEqual(rawValue, existCustomer)) {
						return;
					}
				}
				this.customerChanges.emit(rawValue);
			}
		}
	}
}
