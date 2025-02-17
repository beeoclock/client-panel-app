import {ChangeDetectionStrategy, Component, HostBinding, input, ViewEncapsulation} from "@angular/core";
import {FormControl} from "@angular/forms";

import {NgClass} from "@angular/common";
import {LanguageNamePipe} from "@utility/presentation/pipes/language-name/language-name.pipe";
import {LanguageCodeEnum} from "@core/shared/enum";
import {IService} from "@core/business-logic/service/interface/i.service";

@Component({
	standalone: true,
	selector: 'app-language-version-order-control-component',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgClass,
		LanguageNamePipe,
	],
	template: `


		<div class="flex flex-wrap gap-4">
			@for (languageCode of languageCodes; track languageCode) {

				<button
					(click)="setLanguageCode(languageCode)"
					type="button"
					[ngClass]="{'bg-blue-500 border-blue-600 text-white': isSelected(languageCode)}"
					class="rounded-xl border border-beeColor-200 px-3 text-center py-1.5 dark:bg-beeDarkColor-800 dark:border-beeDarkColor-700 dark:text-white hover:bg-blue-300 active:bg-blue-500">
					{{ languageCode | languageName }}
				</button>
			}
		</div>

		@if (languageVersion) {

			<div class="flex-1 flex flex-col gap-2">
				<div class="font-bold line-clamp-2">
					{{ languageVersion.title }}
				</div>
				<div class="text-beeColor-500 line-clamp-2 hidden md:block">
					{{ languageVersion.description }}
				</div>
			</div>
		}

	`
})
export class LanguageVersionOrderControlComponent {

	public readonly serviceListControl = input.required<FormControl<IService.DTO[]>>();

	public readonly languageControl = input.required<FormControl<LanguageCodeEnum>>();

	public readonly index = input.required<number>();

	public readonly service = input.required<IService.DTO>();

	@HostBinding()
	public class = 'flex flex-col gap-4'

	public get languageCodes(): LanguageCodeEnum[] {
		return this.service().languageVersions.map(({language}) => language);
	}

	public get languageVersion() {
		return this.service().languageVersions.find(({language}) => language === this.languageControl().value);
	}

	public isSelected(languageCode: string): boolean {
		return this.languageControl().value === languageCode;
	}

	public setLanguageCode(languageCode: LanguageCodeEnum): void {
		this.languageControl().setValue(languageCode);
	}

}
