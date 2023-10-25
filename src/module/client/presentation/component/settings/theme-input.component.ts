import {Component, inject} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {ThemeService} from "@utility/cdk/theme.service";

@Component({
	selector: 'client-settings-theme-input-component',
	standalone: true,
	imports: [
		NgSelectModule,
		ReactiveFormsModule,
		TranslateModule,
		DefaultLabelDirective
	],
	template: `
		<label default for="client-settings-form-theme">
			{{ 'keyword.capitalize.theme' | translate }}
		</label>
		<ng-select
			id="client-settings-form-theme"
			[items]="themes"
			[clearable]="false"
			[formControl]="control">
			<ng-template ng-label-tmp let-item="item" let-clear="clear">
				{{ baseTranslationKey + item | translate }}
			</ng-template>
			<ng-template ng-option-tmp let-item="item" let-clear="clear">
				{{ baseTranslationKey + item | translate }}
			</ng-template>
		</ng-select>
	`
})
export class ThemeInputComponent {

	public readonly control = new FormControl();
	public readonly translateService = inject(TranslateService);
	public readonly themeService = inject(ThemeService);

	public readonly themes = this.themeService.themes;
	public readonly baseTranslationKey = 'enum.theme.';

	constructor() {
		this.control.setValue(this.themeService.theme);
		this.control.valueChanges.subscribe((theme) => {
			this.themeService.toggleTheme(theme);
		});
	}

}
