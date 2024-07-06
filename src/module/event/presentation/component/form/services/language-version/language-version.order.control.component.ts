import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from "@angular/core";
import {FormControl} from "@angular/forms";
import {IService} from "@service/domain";
import {NgClass, NgForOf} from "@angular/common";
import {LanguageNamePipe} from "@utility/presentation/pipes/language-name/language-name.pipe";
import {LanguageCodeEnum} from "@utility/domain/enum";

@Component({
	standalone: true,
	selector: 'app-language-version-order-control-component',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgForOf,
		NgClass,
		LanguageNamePipe
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

		<div class="flex-1 flex flex-col gap-2">
			<div class="font-bold line-clamp-2">
				{{ service.languageVersions[0].title }}
			</div>
			<div class="text-beeColor-500 line-clamp-2 hidden md:block">
				{{ service.languageVersions[0].description }}
			</div>
		</div>

	`
})
export class LanguageVersionOrderControlComponent {

	@Input({required: true})
	public serviceListControl!: FormControl<IService[]>;

	@Input({required: true})
	public index!: number;

	@Input({required: true})
	public service!: IService;

	public get languageCodes(): LanguageCodeEnum[] {
		return this.service.languageVersions.map(({language}) => language);
	}

	public isSelected(languageCode: string): boolean {
		return this.serviceListControl.value[this.index].languageVersions.some(({language}) => language === languageCode);
	}

	public setLanguageCode(languageCode: string): void {
		const services = this.serviceListControl.value.map((service, index) => {
			if (this.index === index) {
				return {
					...service,
					languageVersions: service.languageVersions.map(languageVersion => {
						if (languageVersion.language === languageCode) {
							return {
								...languageVersion,
								order: 0
							};
						}
						return {
							...languageVersion,
							order: 1
						};
					})
				};
			}
			return service;
		});
		this.serviceListControl.setValue(services);
	}

}
