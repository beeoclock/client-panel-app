import {Component, HostBinding, input, ViewEncapsulation} from "@angular/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
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
			class="!min-h-0"
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
		DefaultLabelDirective,
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

	@HostBinding()
	public class = 'px-4 flex items-center border border-beeColor-300 rounded-lg';

}
