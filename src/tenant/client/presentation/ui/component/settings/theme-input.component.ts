import {Component, inject, OnInit} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {DefaultLabelDirective} from "@shared/presentation/directives/label/default.label.directive";
import {ThemeService} from "@core/cdk/theme.service";
import {
	ThemeBusinessPanelFrontendSettingsAccountApiAdapter
} from "@tenant/account/infrastructure/adapter/external/api/theme.business-panel.frontend-settings.account.api.adapter";
import {Reactive} from "@core/cdk/reactive";

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
export class ThemeInputComponent extends Reactive implements OnInit {

	public readonly control = new FormControl();
	public readonly themeService = inject(ThemeService);
	public readonly themeBusinessPanelFrontendSettingsAccountApiAdapter = inject(ThemeBusinessPanelFrontendSettingsAccountApiAdapter);

	public readonly themes = this.themeService.themes;
	public readonly baseTranslationKey = 'enum.theme.';

	public ngOnInit() {

		this.control.setValue(this.themeService.theme);
		this.control.valueChanges.pipe(this.takeUntil()).subscribe((theme) => {
			this.themeService.toggleTheme(theme);
			this.themeBusinessPanelFrontendSettingsAccountApiAdapter.executeAsync(theme);
		});

	}

}
