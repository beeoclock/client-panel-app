import {ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation} from "@angular/core";
import {FormControl} from "@angular/forms";

import {NgClass, NgForOf, NgIf} from "@angular/common";
import {LanguageNamePipe} from "@utility/presentation/pipes/language-name/language-name.pipe";
import {LanguageCodeEnum} from "@utility/domain/enum";
import {IServiceDto} from "@order/external/interface/i.service.dto";

@Component({
	standalone: true,
	selector: 'app-language-version-order-control-component',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgForOf,
		NgClass,
		LanguageNamePipe,
		NgIf
	],
	template: `


		<div class="flex flex-wrap gap-4">
			<ng-container *ngFor="let languageCode of languageCodes">
				<button
					(click)="setLanguageCode(languageCode)"
					type="button"
					[ngClass]="{'bg-blue-500 border-blue-600 text-white': isSelected(languageCode)}"
					class="rounded-xl border border-beeColor-200 px-3 text-center py-1.5 dark:bg-beeDarkColor-800 dark:border-beeDarkColor-700 dark:text-white hover:bg-blue-300 active:bg-blue-500">
					{{ languageCode | languageName }}
				</button>
			</ng-container>
		</div>

		<div *ngIf="languageVersion" class="flex-1 flex flex-col gap-2">
			<div class="font-bold line-clamp-2">
				{{ languageVersion.title }}
			</div>
			<div class="text-beeColor-500 line-clamp-2 hidden md:block">
				{{ languageVersion.description }}
			</div>
		</div>

	`
})
export class LanguageVersionOrderControlComponent {

	@Input({required: true})
	public serviceListControl!: FormControl<IServiceDto[]>;

	@Input({required: true})
	public languageControl: FormControl<LanguageCodeEnum> = new FormControl();

	@Input({required: true})
	public index!: number;

	@Input({required: true})
	public service!: IServiceDto;

	@HostBinding()
	public class = 'flex flex-col gap-4'

	public get languageCodes(): LanguageCodeEnum[] {
		return this.service.languageVersions.map(({language}) => language);
	}

	public get languageVersion() {
		return this.service.languageVersions.find(({language}) => language === this.languageControl.value);
	}

	public isSelected(languageCode: string): boolean {
		return this.languageControl.value === languageCode;
	}

	public setLanguageCode(languageCode: LanguageCodeEnum): void {
		this.languageControl.setValue(languageCode);
	}

}
