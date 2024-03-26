import {ChangeDetectionStrategy, Component, ViewEncapsulation} from "@angular/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {LanguageInputComponent} from "@client/presentation/component/settings/language-input.component";
import {ThemeInputComponent} from "@client/presentation/component/settings/theme-input.component";

@Component({
	selector: 'client-general-settings-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CardComponent,
		TranslateModule,
		ReactiveFormsModule,
		LanguageInputComponent,
		ThemeInputComponent
	],
	template: `
		<bee-card>
			<span class="text-2xl font-bold text-beeColor-500">{{ 'keyword.capitalize.general' | translate }}</span>

<!--			<client-settings-theme-input-component/>-->

			<client-settings-language-input-component/>

		</bee-card>
	`
})
export class GeneralSettingsComponent {

}
