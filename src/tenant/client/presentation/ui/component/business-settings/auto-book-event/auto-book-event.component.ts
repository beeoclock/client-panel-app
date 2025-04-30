import {Component, inject, input, ViewEncapsulation} from "@angular/core";
import {NotificationCoreService} from "@core/cdk/notification.core.service";
import {AsyncPipe} from "@angular/common";
import {CardComponent} from "@shared/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {SwitchComponent} from "@shared/presentation/component/switch/switch.component";
import {FormControl} from "@angular/forms";
import {NGXLogger} from "ngx-logger";

@Component({
	selector: 'client-auto-book-event',
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	imports: [
		AsyncPipe,
		CardComponent,
		TranslateModule,
		SwitchComponent
	],
	template: `
		<bee-card>

			<utility-switch-component
				[booleanValue]="true"
				[label]="'client.settings.form.autoBookOrder.label' | translate"
				[id]="id"
				[control]="control()"/>

		</bee-card>
	`
})
export class AutoBookEventComponent {

	public readonly id = 'client-settings-auto-book-event-switcher';

	public readonly control = input.required<FormControl<boolean>>();

	private readonly notificationService = inject(NotificationCoreService);
	private readonly ngxLogger = inject(NGXLogger);

	public get permissionIsGranted() {
		return this.notificationService.permissionIsGranted;
	}

}
