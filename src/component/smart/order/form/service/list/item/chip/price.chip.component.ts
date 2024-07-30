import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewEncapsulation
} from "@angular/core";
import {IonPopover} from "@ionic/angular/standalone";
import {CurrencyPipe, NgSwitch, NgSwitchCase} from "@angular/common";
import {
	CustomerTypeCustomerComponent
} from "@customer/presentation/component/form/by-customer-type/customer-type.customer.component";
import {TranslateModule} from "@ngx-translate/core";
import ObjectID from "bson-objectid";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {FormControl} from "@angular/forms";
import {Reactive} from "@utility/cdk/reactive";
import {CurrencyCodeEnum} from "@utility/domain/enum";

@Component({
	selector: 'app-price-chip-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgSwitch,
		IonPopover,
		CustomerTypeCustomerComponent,
		TranslateModule,
		NgSwitchCase,
		CurrencyPipe,
		FormInputComponent
	],
	template: `
		<button
			[id]="'input-price-' + id"
			class="px-3 py-2 rounded-lg border border-gray-200 justify-center items-center flex">
			<div class="text-slate-900 text-sm font-normal">
				{{ priceFormControl.value | currency: currency }}
			</div>
		</button>
		<ion-popover [trigger]="'input-price-' + id" [keepContentsMounted]="true">
			<ng-template>
				<form-input inputType="number" [control]="priceFormControl"/>
			</ng-template>
		</ion-popover>
	`
})
export class PriceChipComponent extends Reactive implements OnInit {

	@Input()
	public initialValue: number = 0;

	@Input()
	public currency: CurrencyCodeEnum | undefined;

	@Input()
	public id: string = ObjectID().toHexString();

	@Output()
	public readonly priceChanges = new EventEmitter<number>();

	public readonly priceFormControl = new FormControl<number>(0, {
		nonNullable: true,
	});

	public ngOnInit() {
		this.priceFormControl.setValue(this.initialValue);
		this.priceFormControl.valueChanges.pipe(
			this.takeUntil()
		).subscribe({
			next: (value) => {
				this.priceChanges.emit(+value)
			}
		});
	}

}
