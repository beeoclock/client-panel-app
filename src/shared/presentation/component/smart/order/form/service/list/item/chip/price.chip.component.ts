import {ChangeDetectionStrategy, Component, input, OnInit, output} from "@angular/core";
import {IonPopover} from "@ionic/angular/standalone";
import {CurrencyPipe} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import ObjectID from "bson-objectid";
import {FormInputComponent} from "@shared/presentation/component/input/form.input.component";
import {FormControl} from "@angular/forms";
import {Reactive} from "@core/cdk/reactive";
import {CurrencyCodeEnum} from "@core/shared/enum";
import {PrimaryButtonDirective} from "@shared/presentation/directives/button/primary.button.directive";
import {DefaultButtonDirective} from "@shared/presentation/directives/button/default.button.directive";

@Component({
	selector: 'app-price-chip-component',
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
		CurrencyPipe,
		FormInputComponent,
		PrimaryButtonDirective,
		DefaultButtonDirective,
	],
	template: `
		<button
			(click)="initCache()"
			[id]="'input-price-button-' + id()"
			class="px-3 py-2 border border-gray-200 justify-center items-center flex bg-white rounded-lg hover:bg-neutral-300 hover:border-neutral-400">
			<div class="text-slate-900 text-sm font-normal">
				{{ ((cachedValue ?? priceFormControl.value) | currency: currency()) ?? '-' }}
			</div>
		</button>
		<ion-popover #popover [trigger]="'input-price-button-' + id()" [keepContentsMounted]="true">
			<ng-template>
				<div class="flex flex-col p-2 gap-2">

					<form-input inputType="number" [min]="0" [control]="priceFormControl" [id]="id() + '-price'"
								[label]="'keyword.capitalize.price' | translate"/>
					<div class="flex gap-2">
						<button
							default
							(click)="popover.dismiss();resetChanges();">
							<div class="text-slate text-sm font-normal">
								{{ 'keyword.capitalize.cancel' | translate }}
							</div>
						</button>
						<button
							primary
							(click)="popover.dismiss();priceChanges.emit(+priceFormControl.value);this.clearCache();">
							<div class="text-slate text-sm font-normal">
								{{ 'keyword.capitalize.confirm' | translate }}
							</div>
						</button>
					</div>
				</div>
			</ng-template>
		</ion-popover>
	`
})
export class PriceChipComponent extends Reactive implements OnInit {

	public readonly initialValue = input<number>(0);

	public readonly currency = input<CurrencyCodeEnum>();

	public readonly id = input<string>(ObjectID().toHexString());

	public readonly priceChanges = output<number>();

	protected cachedValue: number | null = null;

	public readonly priceFormControl = new FormControl<number>(0, {
		nonNullable: true,
	});

	public ngOnInit() {
		this.priceFormControl.setValue(this.initialValue());
	}

	protected initCache() {
		this.cachedValue = this.priceFormControl.value;
	}

	protected resetChanges() {
		if (!this.cachedValue) {
			return;
		}
		this.priceFormControl.setValue(this.cachedValue);
		this.clearCache();
	}

	protected clearCache() {
		this.cachedValue = null;
	}

}
