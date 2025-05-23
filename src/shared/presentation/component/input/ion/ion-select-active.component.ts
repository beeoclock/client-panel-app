import {ChangeDetectionStrategy, Component, inject, input, OnInit, ViewEncapsulation} from "@angular/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ActiveEnum} from "@core/shared/enum";
import {is} from "@core/shared/checker";
import {IonSelect, IonSelectOption} from "@ionic/angular/standalone";

@Component({
	selector: 'ion-select-active',
	standalone: true,
	template: `
		<ion-select
			[formControl]="control()"
			class="!min-h-0 px-4 py-3 border border-beeColor-300 rounded-2xl h-full"
			fill="solid"
			interface="popover">
			@for (status of statusList; track status.id) {
				<ion-select-option [value]="status.id">
					{{ status.label }}
				</ion-select-option>
			}
		</ion-select>
	`,
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgSelectModule,
		ReactiveFormsModule,
		TranslateModule,
		IonSelect,
		IonSelectOption,
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class IonSelectActiveComponent implements OnInit {

	public readonly id = input('');

	public readonly control = input(new FormControl());

	public readonly addAllOption = input(true);

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
		if (!this.addAllOption()) {
			return;
		}
		this.statusList.unshift({
			id: null,
			label: this.translateService.instant('keyword.status.all')
		});
	}
}
