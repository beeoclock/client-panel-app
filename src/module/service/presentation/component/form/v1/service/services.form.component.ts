import {LanguageVersionsForm} from '@service/presentation/form/service.form';
import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {AsyncPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {ServiceFormComponent} from '@service/presentation/component/form/v1/service/service.form.component';
import {LanguageCodeEnum, LanguageRecord} from '@utility/domain/enum';
import {Select} from "@ngxs/store";
import {ClientState} from "@client/state/client/client.state";
import {filter, firstValueFrom, map, Observable} from "rxjs";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {FormButtonWithIconComponent} from "@utility/presentation/component/button/form-button-with-icon.component";
import {TranslateModule} from "@ngx-translate/core";
import {Reactive} from "@utility/cdk/reactive";
import {DetailsBlockComponent} from "@service/presentation/component/form/v2/details/details-block.component";

@Component({
	selector: 'service-services-form-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgForOf,
		ServiceFormComponent,
		NgIf,
		AsyncPipe,
		PrimaryButtonDirective,
		FormButtonWithIconComponent,
		TranslateModule,
		NgClass,
		DetailsBlockComponent,
	],
	template: `

		<ng-container *ngIf="businessHasMoreThanOneLanguage$ | async; else SingleLanguageTemplate">


			<div class="bg-white dark:bg-beeDarkColor-800 dark:border dark:border-beeDarkColor-700 shadow rounded-2xl"
					 id="accordion-open" data-accordion="open">

				<div class="p-4 pb-0">
					<h2 class="text-2xl font-bold text-beeColor-500">
						{{ 'service.form.v2.section.availableLanguages.title' | translate }}
					</h2>
					<p class="italic leading-tight p-2 text-beeColor-500 text-sm">{{ 'service.form.v2.section.availableLanguages.hint' | translate }}</p>
				</div>

				<div class="p-4 flex flex-wrap gap-4">
					<ng-container *ngFor="let availableLanguage of availableLanguages$ | async">
						<button
							(click)="pushNewLanguageVersionForm(availableLanguage)"
							type="button"
							[ngClass]="{
							'bg-blue-500 text-white': isLanguageSelected(availableLanguage)
						}"
							class="rounded-xl border px-3 text-center py-1.5 dark:bg-beeDarkColor-800 dark:border-beeDarkColor-700 dark:text-white border-neutral-100 hover:bg-blue-300 active:bg-blue-500">
							{{ getLanguageName(availableLanguage) }}
						</button>
					</ng-container>
				</div>

				<div class="border-t p-4 flex flex-col gap-4" *ngFor="let languageVersionForm of form.controls; let index = index">

					<div class="flex justify-between">
						<h2 class="text-2xl font-bold">
							{{ getLanguageName(languageVersionForm.controls.language.value) }}
						</h2>
						<button type="button" class="text-red-500" (click)="removeLanguageVersion(index)"
										*ngIf="form.controls.length > 1">
							<i class="bi bi-trash"></i>
						</button>
					</div>
					<service-service-form-component
						[hiddenControls]="['language']"
						[form]="languageVersionForm"/>
				</div>

			</div>

		</ng-container>

		<ng-template #SingleLanguageTemplate>

			<service-form-details-block-component
				[useCardBorder]="false"
				[form]="form.controls[0]"/>

		</ng-template>

	`
})
export class ServicesFormComponent extends Reactive implements OnInit {

	@Input()
	public form = new LanguageVersionsForm();

	@Select(ClientState.availableLanguages)
	public availableLanguages$!: Observable<LanguageCodeEnum[] | undefined>;

	public readonly businessHasMoreThanOneLanguage$ = this.availableLanguages$.pipe(
		filter(Array.isArray),
		map((languages) => languages.length > 1)
	);

	public readonly showAddMore = new BooleanStreamState();

	public ngOnInit() {
		this.availableLanguages$.pipe(this.takeUntil()).subscribe((availableLanguages) => {
			if (this.form.length === 0 && availableLanguages) {
				this.pushNewLanguageVersionForm(availableLanguages[0]);
			}
		});
	}

	public async updateShowAddMore(): Promise<void> {
		const availableLanguages = await firstValueFrom(this.availableLanguages$);
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
