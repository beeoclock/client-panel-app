import {Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {FormControl} from "@angular/forms";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";
import {TagsComponent} from "@service/presentation/component/form/v2/details/tags.component";
import {SpecialistsComponent} from "@service/presentation/component/form/v2/prices/specialists.component";
import {PriceAndCurrencyComponent} from "@utility/presentation/component/input/price-and-currency.component";
import {InputBadgeComponent} from "@utility/presentation/component/input/input-badge.component";
import {TimeInputComponent} from "@utility/presentation/component/input/time.input.component";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {IonicModule} from "@ionic/angular";

@Component({
	selector: 'service-form-duration-block-component',
	standalone: true,
	template: `
		<ion-list>
			<ion-item>
				<ion-alert [isOpen]="true">
					Hello world
				</ion-alert>
				<ion-select label="Alert" [interfaceOptions]="customAlertOptions" interface="alert" placeholder="Select One">
					<ion-select-option value="bacon">Bacon</ion-select-option>
					<ion-select-option value="onions">Onions</ion-select-option>
					<ion-select-option value="pepperoni">Pepperoni</ion-select-option>
				</ion-select>
			</ion-item>

			<ion-item>
				<ion-select label="Popover" [interfaceOptions]="customPopoverOptions" interface="popover" placeholder="Select One">
					<ion-select-option value="brown">Brown</ion-select-option>
					<ion-select-option value="blonde">
						<ion-datetime></ion-datetime></ion-select-option>
				</ion-select>
			</ion-item>

			<ion-item>
				<ion-select
					label="Action Sheet"
					[interfaceOptions]="customActionSheetOptions"
					interface="action-sheet"
					placeholder="Select One"
				>
					<ion-select-option value="red">Red</ion-select-option>
					<ion-select-option value="green">Green</ion-select-option>
					<ion-select-option value="blue">Blue</ion-select-option>
					<ion-select-option value="blue">
						<time-input-component
							[utc]="false"
							[showLabel]="false"
							[control]="durationInSecondsControl"/>
					</ion-select-option>
				</ion-select>
			</ion-item>
		</ion-list>


		<label default>
			{{ 'keyword.you.capitalize.select' | translate }} {{ 'keyword.lowercase.duration' | translate }}
		</label>
		<div class="flex flex-wrap gap-3 items-center">
			<button
				type="button"
				class="
					flex-grow
					rounded-lg
					border
					border-beeColor-300
					text-center
					py-1.5
					px-3
					dark:bg-beeDarkColor-800
					dark:border-beeDarkColor-700
					dark:text-white">
				24 hours
			</button>
			<button
				type="button"
				class="
					flex-grow
					rounded-lg
					border
					border-beeColor-300
					text-center
					py-1.5
					px-3
					dark:bg-beeDarkColor-800
					dark:border-beeDarkColor-700
					dark:text-white">
				12 hours
			</button>
			<button
				type="button"
				class="
					flex-grow
					rounded-lg
					border
					border-beeColor-300
					text-center
					py-1.5
					px-3
					dark:bg-beeDarkColor-800
					dark:border-beeDarkColor-700
					dark:text-white">
				8 hours
			</button>
			<button
				type="button"
				class="
					flex-grow
					rounded-lg
					border
					border-beeColor-300
					text-center
					py-1.5
					px-3
					dark:bg-beeDarkColor-800
					dark:border-beeDarkColor-700
					dark:text-white">
				6 hours
			</button>
			<button
				type="button"
				class="
					flex-grow
					rounded-lg
					border
					border-beeColor-300
					text-center
					py-1.5
					px-3
					dark:bg-beeDarkColor-800
					dark:border-beeDarkColor-700
					dark:text-white">
				5 hours
			</button>
			<button
				type="button"
				class="
					flex-grow
					rounded-lg
					border
					border-beeColor-300
					text-center
					py-1.5
					px-3
					dark:bg-beeDarkColor-800
					dark:border-beeDarkColor-700
					dark:text-white">
				4 hours
			</button>
			<button
				type="button"
				class="
					flex-grow
					rounded-lg
					border
					border-beeColor-300
					text-center
					py-1.5
					px-3
					dark:bg-beeDarkColor-800
					dark:border-beeDarkColor-700
					dark:text-white">
				3 hours
			</button>
			<button
				type="button"
				class="
					flex-grow
					rounded-lg
					border
					border-beeColor-300
					text-center
					py-1.5
					px-3
					dark:bg-beeDarkColor-800
					dark:border-beeDarkColor-700
					dark:text-white">
				2 hours
			</button>
			<button
				type="button"
				class="
					flex-grow
					rounded-lg
					border
					border-beeColor-300
					text-center
					py-1.5
					px-3
					dark:bg-beeDarkColor-800
					dark:border-beeDarkColor-700
					dark:text-white">
				1 hour 45 min
			</button>
			<button
				type="button"
				class="
					bg-blue-500
					border-blue-600
					text-white
					flex-grow
					rounded-lg
					border
					text-center
					py-1.5
					px-3
					dark:bg-beeDarkColor-800
					dark:border-beeDarkColor-700
					dark:text-white">
				1 hour 30 min
			</button>
			<button
				type="button"
				class="
					flex-grow
					rounded-lg
					border
					border-beeColor-300
					text-center
					py-1.5
					px-3
					dark:bg-beeDarkColor-800
					dark:border-beeDarkColor-700
					dark:text-white">
				1 hour 15 minutes
			</button>
			<button
				type="button"
				class="
					flex-grow
					rounded-lg
					border
					border-beeColor-300
					text-center
					py-1.5
					px-3
					dark:bg-beeDarkColor-800
					dark:border-beeDarkColor-700
					dark:text-white">
				1 hour
			</button>
			<button
				type="button"
				class="
					flex-grow
					rounded-lg
					border
					border-beeColor-300
					text-center
					py-1.5
					px-3
					dark:bg-beeDarkColor-800
					dark:border-beeDarkColor-700
					dark:text-white">
				45 minutes
			</button>
			<button
				type="button"
				class="
					flex-grow
					rounded-lg
					border
					border-beeColor-300
					text-center
					py-1.5
					px-3
					dark:bg-beeDarkColor-800
					dark:border-beeDarkColor-700
					dark:text-white">
				30 minutes
			</button>
			<button
				type="button"
				class="
					flex-grow
					rounded-lg
					border
					border-beeColor-300
					text-center
					py-1.5
					px-3
					dark:bg-beeDarkColor-800
					dark:border-beeDarkColor-700
					dark:text-white">
				15 minutes
			</button>
			<div class="flex gap-3 items-center">
				<label default> {{ 'keyword.lowercase.or' | translate }} {{ 'keyword.lowercase.own.option' | translate }} </label>
				<time-input-component
					[utc]="false"
					[showLabel]="false"
					[control]="durationInSecondsControl"/>
			</div>
		</div>
	`,
	imports: [
		NgIf,
		TranslateModule,
		FormInputComponent,
		FormTextareaComponent,
		TagsComponent,
		SpecialistsComponent,
		PriceAndCurrencyComponent,
		InputBadgeComponent,
		TimeInputComponent,
		DefaultLabelDirective,
		IonicModule,
	]
})
export class DurationBlockComponent {
	customAlertOptions = {
		header: 'Pizza Toppings',
		subHeader: 'Select your favorite topping',
		message: 'Choose only one',
		translucent: true,
	};

	customPopoverOptions = {
		header: 'Hair Color',
		subHeader: 'Select your hair color',
		message: 'Only select your dominant hair color',
	};

	customActionSheetOptions = {
		header: 'Colors',
		subHeader: 'Select your favorite color',
	};
	@Input()
	public durationInSecondsControl = new FormControl();

}
