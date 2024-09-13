import {ChangeDetectionStrategy, Component, inject, Input, OnInit, ViewEncapsulation} from "@angular/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {IonicModule} from "@ionic/angular";
import {NgForOf} from "@angular/common";
import {ActiveEnum} from "@utility/domain/enum";
import {is} from "@utility/checker";

@Component({
	selector: 'ion-select-active',
	standalone: true,
	template: `
		<ion-select
			[formControl]="control"
			class="!min-h-0"
			fill="solid"
			interface="popover">
			<ion-select-option
				*ngFor="let status of statusList"
				[value]="status.id">
				{{ status.label }}
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
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class IonSelectActiveComponent implements OnInit {

	@Input()
	public id = '';

	@Input()
	public control = new FormControl();

	@Input()
	public addAllOption = true;

	private readonly translateService = inject(TranslateService);

	public readonly statusList: { id: null | number; label: string; }[] = Object.values(ActiveEnum)
		.filter(is.number)
		.map((status) => ({
			id: status,
			label: this.translateService.instant(`keyword.status.plural.${status}`)
		}));

	public ngOnInit(): void {
		this.initAllOption();
	}


	private initAllOption() {
		if (!this.addAllOption) {
			return;
		}
		this.statusList.unshift({
			id: null,
			label: this.translateService.instant('keyword.status.all')
		});
	}
}
