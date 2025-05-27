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
		<button
			(click)="initCache()"
			[id]="'input-quantity-button-' + id()"
			class="px-3 py-2 rounded-lg border border-gray-200 justify-center items-center flex">
			<div class="text-slate-900 text-sm font-normal">
				{{ (cachedValue ?? quantityFormControl.value) }}
			</div>
		</button>
		<ion-popover #popover [trigger]="'input-quantity-button-' + id()" [keepContentsMounted]="true">
			<ng-template>
				<div class="flex flex-col p-2 gap-2">

					<form-input inputType="number" [min]="0" [control]="quantityFormControl" [id]="id() + '-quantity'"
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
