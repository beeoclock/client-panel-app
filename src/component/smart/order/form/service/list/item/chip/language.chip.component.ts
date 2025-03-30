import {
	ChangeDetectionStrategy,
	Component,
	effect,
	input,
	OnInit,
	output,
	viewChild,
	ViewEncapsulation
} from "@angular/core";
import {IonItem, IonLabel, IonList, IonPopover} from "@ionic/angular/standalone";
import ObjectID from "bson-objectid";
import {FormControl} from "@angular/forms";
import {LanguageCodeEnum} from "@core/shared/enum";
import EService from "@tenant/service/domain/entity/e.service";

@Component({
	selector: 'app-language-chip-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		IonPopover,
		IonItem,
		IonLabel,
		IonList,
	],
	template: `
		<button
			[id]="'select-language-version-' + id()"
			class="w-9 h-9 rounded-lg border border-gray-200 justify-center items-center flex">
			<div class="text-center text-black text-sm font-bold uppercase">
				{{ languageCodeFormControl.value }}
			</div>
		</button>
		<ion-popover [trigger]="'select-language-version-' + id()">
			<ng-template>
				<ion-list>
					@if (serviceEntity(); as service) {
						@for (languageVersion of service.languageVersions; track languageVersion.language) {
							<ion-item [button]="true" lines="full" [detail]="false"
									  (click)="select(languageVersion.language)">
								<ion-label class="uppercase">{{ languageVersion.language }}</ion-label>
							</ion-item>
						}
					}
				</ion-list>
			</ng-template>
		</ion-popover>
	`
})
export class LanguageChipComponent implements OnInit {

	public readonly serviceEntity = input.required<EService | null>();

	public readonly initialValue = input.required<LanguageCodeEnum>();

	public readonly id = input<string>(ObjectID().toHexString());

	public readonly languageChanges = output<LanguageCodeEnum>();

	readonly selectLanguageVersionPopover = viewChild.required(IonPopover);

	public readonly languageCodeFormControl = new FormControl<LanguageCodeEnum>(LanguageCodeEnum.en, {
		nonNullable: true,
	});

	public constructor() {
		effect(() => {
			this.languageCodeFormControl.setValue(this.initialValue());
		});
	}

	public ngOnInit() {
		this.languageCodeFormControl.setValue(this.initialValue());
	}

	public select(language: LanguageCodeEnum) {
		if (this.languageCodeFormControl.value !== language) {
			this.languageCodeFormControl.setValue(language);
			this.selectLanguageVersionPopover().dismiss().then();
			this.languageChanges.emit(language);
		}
	}

}

export default LanguageChipComponent;
