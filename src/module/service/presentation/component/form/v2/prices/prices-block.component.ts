import {Component, OnInit, input} from '@angular/core';
import {NgForOf} from "@angular/common";
import {PriceBlockComponent} from "@service/presentation/component/form/v2/prices/price-block.component";
import {DurationConfigurationForm, DurationVersionsForm} from "@service/presentation/form/service.form";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {SwitchComponent} from "@utility/presentation/component/switch/switch.component";
import {FormControl} from "@angular/forms";
import {Reactive} from "@utility/cdk/reactive";
import {ActiveEnum, CurrencyCodeEnum} from "@utility/domain/enum";
import {DurationVersionTypeEnum} from "@service/domain/enum/duration-version-type.enum";
import {TranslateModule} from "@ngx-translate/core";
import {filter, take} from "rxjs";

@Component({
	selector: 'service-form-prices-block-component',
	standalone: true,
	template: `
		<bee-card>
			<!--      <span class="text-2xl font-bold text-beeColor-500">{{ 'keyword.capitalize.price' | translate }}</span>-->
			<utility-switch-component
				[control]="switchToRangeModeControl"
				[labelTranslateKey]="'service.form.v2.section.prices.switch.range.title'"/>
			<div *ngFor="let durationVersion of durationVersions().controls; let index = index">

				<!--        <div class="flex justify-between">-->
				<!--          <span class="text-beeColor-400">Price version #{{ index + 1 }}</span>-->
				<!--          <button type="button" class="text-beeColor-600 hover:text-red-600 hover:bg-red-100 px-2 py-1 rounded-2xl">-->
				<!--            <i class="bi bi-trash"></i>-->
				<!--          </button>-->
				<!--        </div>-->

				<service-form-price-block-component
					[currencyList]="currencyList()"
					[suffix]="isRangeMode ? (getTranslateSuffixKey(index) | translate) : ''"
					[priceForm]="durationVersion.controls.prices.at(0)"
					[durationInSecondsControl]="durationVersion.controls.durationInSeconds"/>

				<!--        <hr class="mt-4">-->

			</div>

			<!--      <button type="button" (click)="durationVersions.pushNewOne()" class="w-full text-blue-600 rounded px-4 py-2 hover:bg-blue-100">-->
			<!--        <i class="bi bi-plus-lg"></i>-->
			<!--        {{ 'service.form.v2.section.prices.button.add.label' | translate }}-->
			<!--      </button>-->

		</bee-card>
	`,
	imports: [
		PriceBlockComponent,
		NgForOf,
		CardComponent,
		SwitchComponent,
		TranslateModule,
	]
})
export class PricesBlockComponent extends Reactive implements OnInit {

	public readonly durationVersions = input(new DurationVersionsForm());

	public readonly durationConfigurationForm = input(new DurationConfigurationForm());

	public readonly currencyList = input.required<{
    id: CurrencyCodeEnum;
    name: CurrencyCodeEnum;
}[]>();

	public readonly switchToRangeModeControl = new FormControl(ActiveEnum.NO);

	public get isRangeMode(): boolean {
		return this.durationConfigurationForm().controls.durationVersionType.value === DurationVersionTypeEnum.RANGE;
	}

	public getTranslateSuffixKey(index: number): string {
		if (index === 0) {
			return 'service.form.v2.section.prices.suffix.range.from';
		}
		return 'service.form.v2.section.prices.suffix.range.to';
	}

	public ngOnInit() {
		this.durationConfigurationForm().controls.durationVersionType.valueChanges.pipe(
			take(1),
			filter((value) => value === DurationVersionTypeEnum.RANGE),
			this.takeUntil()
		).subscribe(() => {
			this.switchToRangeModeControl.setValue(ActiveEnum.YES);
		});
		this.switchToRangeModeControl.valueChanges.pipe(this.takeUntil()).subscribe((value) => {
			let newValue = DurationVersionTypeEnum.VARIABLE;
			if (value) {
				newValue = DurationVersionTypeEnum.RANGE;
			}
			this.durationConfigurationForm().controls.durationVersionType.setValue(newValue);
		});
	}

}
