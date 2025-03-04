import {Component, inject, Input} from '@angular/core';
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NotificationSettingsFromGroup} from "@client/presentation/form";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {NgSelectComponent} from "@ng-select/ng-select";
import {ReactiveFormsModule} from "@angular/forms";
import {SendNotificationConditionEnum} from "@core/shared/enum/send-notification-condition.enum";

@Component({
	selector: 'app-notification-settings',
	standalone: true,
	imports: [
		CardComponent,
		TranslateModule,
		DefaultLabelDirective,
		NgSelectComponent,
		ReactiveFormsModule
	],
	template: `
		@if (form) {
			<bee-card gap="gap-8">
				<strong class="dark:text-white">
					{{ 'notificationSetting.cardTitle' | translate }}
				</strong>
				<div>
					<div class="relative">
						<label default
							   [for]="'email-notification-flow'">{{ 'notificationSetting.emailNotificationSettings.label' | translate }}</label>
						<ng-select
							bindLabel="name"
							bindValue="value"
							[items]="items"
							[clearable]="false"
							[id]="'email-notification-flow'"
							[formControl]="form.controls.emailNotificationSettings.controls.sendNotificationConditionType">
						</ng-select>
					</div>
					<div class="italic leading-tight p-2 text-beeColor-500 text-sm">
						{{ 'notificationSetting.emailNotificationSettings.hint' | translate }}
					</div>
				</div>
				<div>
					<div class="relative">
						<label default
							   [for]="'email-notification-flow'">{{ 'notificationSetting.smsNotificationSettings.label' | translate }}</label>
						<ng-select
							bindLabel="name"
							bindValue="value"
							[items]="items"
							[clearable]="false"
							[id]="'email-notification-flow'"
							[formControl]="form.controls.smsNotificationSettings.controls.sendNotificationConditionType">
						</ng-select>
					</div>
					<div class="italic leading-tight p-2 text-beeColor-500 text-sm">
						{{ 'notificationSetting.smsNotificationSettings.hint' | translate }}
					</div>
				</div>

			</bee-card>
		}

	`,
	styles: ``
})
export class NotificationSettingsComponent {
	@Input({required: true}) public form!: NotificationSettingsFromGroup;
	readonly translateService: TranslateService = inject(TranslateService);
	readonly items = Object.values(SendNotificationConditionEnum).map(value => ({value, name: this.translateService.instant(`notificationSetting.sendNotificationConditionType.${value}`),}));

}
