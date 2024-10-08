import {LanguageVersionsForm} from '@service/presentation/form/service.form';
import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {AsyncPipe, NgClass} from '@angular/common';
import {LanguageCodeEnum, LanguageRecord} from '@utility/domain/enum';
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {FormButtonWithIconComponent} from "@utility/presentation/component/button/form-button-with-icon.component";
import {TranslateModule} from "@ngx-translate/core";
import {Reactive} from "@utility/cdk/reactive";
import {DetailsBlockComponent} from "@service/presentation/component/form/v2/details/details-block.component";
import {ServiceFormComponent} from "@service/presentation/component/form/v2/service/service.form.component";
import {IconComponent} from "@src/component/adapter/icon/icon.component";

@Component({
	selector: 'service-services-form-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		AsyncPipe,
		PrimaryButtonDirective,
		FormButtonWithIconComponent,
		TranslateModule,
		NgClass,
		DetailsBlockComponent,
		ServiceFormComponent,
		IconComponent,
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
					@for (availableLanguage of availableLanguages; track availableLanguage) {
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
				@for (languageVersionForm of form.controls; track languageVersionForm.language; let index = $index) {

					<div class="border-t p-4 flex flex-col gap-4">

						<div class="flex justify-between">
							<h2 class="text-2xl font-bold">
								{{ getLanguageName(languageVersionForm.controls.language.value) }}
							</h2>
							@if (form.controls.length > 1) {
								<button type="button" class="text-red-500" (click)="removeLanguageVersion(index)">
									<app-icon name="bootstrapTrash"/>
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

	@Input()
	public availableLanguages: LanguageCodeEnum[] = [];

	public get businessHasMoreThanOneLanguage() {
		return this.availableLanguages.length > 0;
	}

	public readonly showAddMore = new BooleanStreamState();

	public ngOnInit() {

		if (this.form.length === 0 && this.availableLanguages.length) {
			this.pushNewLanguageVersionForm(this.availableLanguages[0]);
		}

	}

	public async updateShowAddMore(): Promise<void> {
		if (!this.availableLanguages) {
			this.showAddMore.doFalse();
			return;
		}
		this.showAddMore.toggle(this.form.length < this.availableLanguages.length);
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
