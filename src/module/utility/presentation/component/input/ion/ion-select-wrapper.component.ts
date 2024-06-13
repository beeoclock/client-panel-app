import {Component, HostBinding, inject, Input, OnInit, ViewEncapsulation} from "@angular/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {IonicModule} from "@ionic/angular";
import {NgForOf} from "@angular/common";

@Component({
	selector: 'ion-select-wrapper',
	standalone: true,
	template: `
		<ion-select
			[formControl]="control"
			[multiple]="multiple"
			class="!min-h-0"
			fill="solid"
			interface="popover">
			<ion-select-option
				*ngFor="let option of options"
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
export class IonSelectWrapperComponent implements OnInit {

	@Input({required: true})
	public id!: string;

	@Input({required: true})
	public control!: FormControl;

	@Input()
	public multiple = false;

	@Input()
	public addAllOption = true;

	@Input({required: true})
	public options: {
		value: any;
		label: string;
	}[] = [];

	@HostBinding()
	public class = 'px-4 py-2 border border-beeColor-300 rounded-2xl';

	private readonly translateService = inject(TranslateService);

	public ngOnInit(): void {
		this.initAllOption();
	}

	private initAllOption() {
		if (!this.addAllOption) {
			return;
		}
		this.options.unshift({
			value: '',
			label: this.translateService.instant('event.keyword.status.all')
		});
	}
}
