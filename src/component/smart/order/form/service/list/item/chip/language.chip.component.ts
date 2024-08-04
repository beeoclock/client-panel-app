import {ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation} from "@angular/core";
import {IonItem, IonLabel, IonList, IonPopover} from "@ionic/angular/standalone";
import {NgForOf} from "@angular/common";
import ObjectID from "bson-objectid";
import {FormControl} from "@angular/forms";
import {Reactive} from "@utility/cdk/reactive";
import {LanguageCodeEnum} from "@utility/domain/enum";
import {RILanguageVersion} from "@service/domain";

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
		NgForOf
	],
	template: `
		<button
			[id]="'select-language-version-' + id"
			class="w-9 h-9 rounded-lg border border-gray-200 justify-center items-center flex">
			<div class="text-center text-black text-sm font-bold uppercase">
				{{ languageCodeFormControl.value }}
			</div>
		</button>
		<ion-popover #selectLanguageVersionPopover [trigger]="'select-language-version-' + id">
			<ng-template>
				<ion-list>
					<ion-item [button]="true" lines="full" [detail]="false"
							  *ngFor="let languageVersion of languageVersions"
							  (click)="languageCodeFormControl.setValue(languageVersion.language);selectLanguageVersionPopover.dismiss()">
						<ion-label class="uppercase">{{ languageVersion.language }}</ion-label>
					</ion-item>
				</ion-list>
			</ng-template>
		</ion-popover>
	`
})
export class LanguageChipComponent extends Reactive implements OnInit {

	@Input({required: true})
	public initialValue!: LanguageCodeEnum;

	@Input({ required: true })
	public languageVersions: RILanguageVersion[] = [];

	@Input()
	public id: string = ObjectID().toHexString();

	public readonly languageCodeFormControl = new FormControl<LanguageCodeEnum>(this.initialValue, {
		nonNullable: true,
	});

	public ngOnInit() {
		this.languageCodeFormControl.setValue(this.initialValue);
	}

}
