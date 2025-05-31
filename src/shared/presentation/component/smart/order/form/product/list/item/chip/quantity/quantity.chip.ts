import {ChangeDetectionStrategy, Component, input, OnInit, output} from "@angular/core";
import {IonPopover} from "@ionic/angular/standalone";
import {TranslateModule} from "@ngx-translate/core";
import ObjectID from "bson-objectid";
import {FormInputComponent} from "@shared/presentation/component/input/form.input.component";
import {FormControl} from "@angular/forms";
import {PrimaryButtonDirective} from "@shared/presentation/directives/button/primary.button.directive";
import {DefaultButtonDirective} from "@shared/presentation/directives/button/default.button.directive";

@Component({
	selector: 'quantity-chip',
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
		FormInputComponent,
		PrimaryButtonDirective,
		DefaultButtonDirective,
	],
	template: `
		<!-- Input Number -->
		<div class="inline-block bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700" data-hs-input-number="">
			<div class="flex items-center">
				<button (click)="decrement()" type="button" role="button" class="size-9 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" tabindex="-1" aria-label="Decrease">
					<svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M5 12h14"></path>
					</svg>
				</button>
<!--				<input class="p-0 w-6 bg-transparent border-0 text-gray-800 text-center focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-white" style="-moz-appearance: textfield;" type="number" aria-roledescription="Number field" value="0" data-hs-input-number-input="">-->

				<button
					(click)="initCache()"
					[id]="'input-quantity-button-' + id()"
					class="px-4 border-x h-9 border-gray-200 justify-center items-center flex">
					<div class="text-slate-900 text-sm font-normal">
						{{ (cachedValue ?? quantityFormControl.value) }}
					</div>
				</button>
				<button (click)="increment()" type="button" role="button" class="size-9 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" tabindex="-1" aria-label="Increase">
					<svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M5 12h14"></path>
						<path d="M12 5v14"></path>
					</svg>
				</button>
			</div>
		</div>
		<!-- End Input Number -->
		<ion-popover #popover [trigger]="'input-quantity-button-' + id()" [keepContentsMounted]="true">
			<ng-template>
				<div class="flex flex-col p-2 gap-2">

					<form-input inputType="number" [min]="1" [control]="quantityFormControl" [id]="id() + '-quantity'"
								[label]="'keyword.capitalize.quantity' | translate"/>
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
							(click)="popover.dismiss();quantityChanges.emit(+quantityFormControl.value);this.clearCache();">
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
export class QuantityChip implements OnInit {

	public readonly initialValue = input<number>(0);

	public readonly id = input<string>(ObjectID().toHexString());

	public readonly quantityChanges = output<number>();

	protected cachedValue: number | null = null;

	public readonly quantityFormControl = new FormControl<number>(0, {
		nonNullable: true,
	});

	public increment() {
		const currentValue = this.quantityFormControl.value;
		const newValue = +currentValue + 1;
		this.quantityFormControl.setValue(newValue);
		this.quantityChanges.emit(newValue);
	}

	public decrement() {
		const currentValue = this.quantityFormControl.value;
		if (currentValue > 1) {
			const newValue = +currentValue - 1;
			this.quantityFormControl.setValue(newValue);
			this.quantityChanges.emit(newValue);
		}
	}

	public ngOnInit() {
		this.quantityFormControl.setValue(this.initialValue());
	}

	protected initCache() {
		this.cachedValue = this.quantityFormControl.value;
	}

	protected resetChanges() {
		if (!this.cachedValue) {
			return;
		}
		this.quantityFormControl.setValue(this.cachedValue);
		this.clearCache();
	}

	protected clearCache() {
		this.cachedValue = null;
	}

}
