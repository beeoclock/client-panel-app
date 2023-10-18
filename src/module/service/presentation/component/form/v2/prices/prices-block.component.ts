import {Component, Input} from '@angular/core';
import {NgForOf} from "@angular/common";
import {PriceBlockComponent} from "@service/presentation/component/form/v2/prices/price-block.component";
import {DurationVersionsForm} from "@service/presentation/form/service.form";
import {CardComponent} from "@utility/presentation/component/card/card.component";

@Component({
	selector: 'service-form-prices-block-component',
	standalone: true,
	template: `
		<bee-card [useBorder]="useCardBorder">
			<!--      <span class="text-2xl font-bold text-beeColor-500">{{ 'keyword.capitalize.price' | translate }}</span>-->

			<div *ngFor="let durationVersion of durationVersions.controls; let index = index">

				<!--        <div class="flex justify-between">-->
				<!--          <span class="text-beeColor-400">Price version #{{ index + 1 }}</span>-->
				<!--          <button type="button" class="text-beeColor-600 hover:text-red-600 hover:bg-red-100 px-2 py-1 rounded-2xl">-->
				<!--            <i class="bi bi-trash"></i>-->
				<!--          </button>-->
				<!--        </div>-->

				<service-form-price-block-component
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
	]
})
export class PricesBlockComponent {

	@Input()
	public durationVersions = new DurationVersionsForm();

	@Input()
	public useCardBorder = true;

}
