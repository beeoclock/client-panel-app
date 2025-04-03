import {ChangeDetectionStrategy, Component, inject, input, ViewEncapsulation} from "@angular/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {StateEnum} from "@core/shared/enum/state.enum";
import {IonSelect, IonSelectOption} from "@ionic/angular/standalone";

@Component({
	selector: 'ion-select-state',
	standalone: true,
	template: `
		<ion-select
			[formControl]="control()"
			[multiple]="true"
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
		IonSelect,
		IonSelectOption,
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class IonSelectStateComponent {

	public readonly id = input('');

	public readonly control = input(new FormControl());

	private readonly translateService = inject(TranslateService);

	public readonly stateList: { id: string | null; label: string; }[] = [
		StateEnum.active,
		StateEnum.inactive,
		StateEnum.archived,
	].map((state) => ({
		id: state,
		label: this.translateService.instant(`keyword.state.plural.${state}`)
	}));

}
