import {LanguageVersionsForm} from '@tenant/service/presentation/form/service.form';
import {Component, Input, input, OnInit, ViewEncapsulation} from '@angular/core';
import {NgClass} from '@angular/common';
import {LanguageCodeEnum, LanguageRecord} from '@core/shared/enum';
import {BooleanStreamState} from "@shared/domain/boolean-stream.state";
import {TranslateModule} from "@ngx-translate/core";
import {Reactive} from "@core/cdk/reactive";
import {DetailsBlockComponent} from "@tenant/service/presentation/ui/component/form/v2/details/details-block.component";
import {ServiceFormComponent} from "@tenant/service/presentation/ui/component/form/v2/service/service.form.component";

@Component({
	selector: 'service-services-form-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		NgClass,
		DetailsBlockComponent,
		ServiceFormComponent,
	],
	template: `

		@if (businessHasMoreThanOneLanguage) {

			<div class="bg-white dark:bg-beeDarkColor-800 dark:border dark:border-beeDarkColor-700 shadow rounded-2xl"
				 id="accordion-open" data-accordion="open">

				<div class="p-4 pb-0">
					<h2 class="text-2xl font-bold text-beeColor-500">
						{{ 'service.form.v2.section.availableLanguages.title' | translate }}
					</h2>
					<p class="italic leading-tight p-2 text-beeColor-500 text-sm">{{ 'service.form.v2.section.availableLanguages.hint' | translate }}</p>
				</div>

				<div class="p-4 flex flex-wrap gap-4">
					@for (availableLanguage of availableLanguages(); track availableLanguage) {
						<button
							(click)="pushNewLanguageVersionForm(availableLanguage)"
							type="button"
							[ngClass]="{
							'bg-blue-500 text-white': isLanguageSelected(availableLanguage)
						}"
							class="rounded-xl border px-3 text-center py-1.5 dark:bg-beeDarkColor-800 dark:border-beeDarkColor-700 dark:text-white border-neutral-100 hover:bg-blue-300 active:bg-blue-500">
							{{ getLanguageName(availableLanguage) }}
						</button>
					}
				</div>

				@for (languageVersionForm of form.controls; track languageVersionForm.language) {

					<div class="border-t p-4 flex flex-col gap-4">

						<div class="flex justify-between">
							<h2 class="text-2xl font-bold">
								{{ getLanguageName(languageVersionForm.controls.language.value) }}
							</h2>
							@if (form.controls.length) {

								<button type="button" class="text-red-500" (click)="removeLanguageVersion($index)">
									<i class="bi bi-trash"></i>
								</button>
							}
						</div>
						<service-service-form-component
							[hiddenControls]="['language']"
							[form]="languageVersionForm"/>
					</div>
				}

			</div>

		} @else {

			<service-form-details-block-component
				[form]="form.controls[0]"/>
		}

	`
})
export class ServicesFormComponent extends Reactive implements OnInit {

	@Input()
	public form = new LanguageVersionsForm();

	public readonly availableLanguages = input<LanguageCodeEnum[]>([]);

	public get businessHasMoreThanOneLanguage() {
		return this.availableLanguages().length > 0;
	}

	public readonly showAddMore = new BooleanStreamState();

	public ngOnInit() {

		const availableLanguages = this.availableLanguages();
		if (this.form.length === 0 && availableLanguages.length) {
			this.pushNewLanguageVersionForm(availableLanguages[0]);
		}

	}

	public async updateShowAddMore(): Promise<void> {
		const availableLanguages = this.availableLanguages();
		if (!availableLanguages) {
			this.showAddMore.doFalse();
			return;
		}
		this.showAddMore.toggle(this.form.length < availableLanguages.length);
	}

	public pushNewLanguageVersionForm(languageCode: LanguageCodeEnum): void {
		this.form.addNewLanguageVersionControl(languageCode);
		this.updateShowAddMore();
	}

	public removeLanguageVersion(index: number): void {
		this.form.removeAt(index);
		this.updateShowAddMore();
	}

	public getLanguageName(language: LanguageCodeEnum): string {
		return LanguageRecord[language];
	}

	public isLanguageSelected(language: LanguageCodeEnum): boolean {
		return !!this.form.controls.find((control) => control.controls.language.value === language);
	}


}
