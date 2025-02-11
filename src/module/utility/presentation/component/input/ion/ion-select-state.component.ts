import {ChangeDetectionStrategy, Component, inject, input, OnInit, ViewEncapsulation} from "@angular/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";
import {StateEnum} from "@utility/domain/enum/state.enum";

@Component({
	selector: 'ion-select-state',
	standalone: true,
	template: `
		<ion-select
			[formControl]="control()"
			class="!min-h-0 px-4 py-3 border border-beeColor-300 rounded-2xl h-full"
			fill="solid"
			interface="popover">
			@for (state of stateList; track state.id) {
				<ion-select-option [value]="state.id">
					{{ state.label }}
				</ion-select-option>
			}
		</ion-select>
	`,
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgSelectModule,
		ReactiveFormsModule,
		TranslateModule,
		IonicModule,
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class IonSelectStateComponent implements OnInit {

	public readonly id = input('');

	public readonly control = input(new FormControl());

	public readonly addAllOption = input(true);

	private readonly translateService = inject(TranslateService);

	public readonly stateList: { id: string | null; label: string; }[] = [
		StateEnum.active,
		StateEnum.inactive,
		StateEnum.archived,
	].map((state) => ({
		id: state,
		label: this.translateService.instant(`keyword.state.plural.${state}`)
	}));

	public ngOnInit(): void {
		this.initAllOption();
	}

	private initAllOption() {
		if (!this.addAllOption()) {
			return;
		}
		this.stateList.unshift({
			id: null,
			label: this.translateService.instant('keyword.status.all')
		});
	}
}
