import {Component, input, ViewEncapsulation} from "@angular/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";
import {NgForOf} from "@angular/common";

@Component({
	selector: 'ion-select-wrapper',
	standalone: true,
	template: `
		<ion-select
			[formControl]="control()"
			[multiple]="multiple()"
			[placeholder]="'event.keyword.status.all' | translate"
			class="!min-h-0 px-4 py-3 border border-beeColor-300 rounded-2xl h-full"
			fill="solid"
			interface="popover">
			<ion-select-option
				*ngFor="let option of options()"
				[value]="option.value">
				{{ option.label }}
			</ion-select-option>
		</ion-select>
	`,
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgSelectModule,
		ReactiveFormsModule,
		TranslateModule,
		IonicModule,
		NgForOf
	],
})
export class IonSelectWrapperComponent {

	public readonly id = input.required<string>();

	public readonly control = input.required<FormControl>();

	public readonly multiple = input(false);

	public readonly options = input.required<{
		value: any;
		label: string;
	}[]>();

}
