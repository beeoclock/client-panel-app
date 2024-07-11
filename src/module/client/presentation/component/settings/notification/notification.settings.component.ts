import {Component, inject, OnInit, ViewEncapsulation} from "@angular/core";
import {NotificationCoreService} from "@utility/cdk/notification.core.service";
import {AsyncPipe} from "@angular/common";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {SwitchComponent} from "@utility/presentation/component/switch/switch.component";
import {FormControl} from "@angular/forms";
import {NGXLogger} from "ngx-logger";
import {Reactive} from "@utility/cdk/reactive";

@Component({
	selector: 'client-notification-settings-page',
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
				labelTranslateKey="keyword.capitalize.notification"
				[id]="id"
				[control]="control"/>

		</bee-card>
	`
})
export class NotificationSettingsComponent extends Reactive implements OnInit {

	public readonly id = 'notification-permission-switcher';

	public readonly control = new FormControl(false);

	private readonly notificationService = inject(NotificationCoreService);
	private readonly ngxLogger = inject(NGXLogger);

	public get permissionIsGranted() {
		return this.notificationService.permissionIsGranted;
	}

	public ngOnInit() {

		this.control.setValue(this.permissionIsGranted);

		this.control.valueChanges.pipe(this.takeUntil()).subscribe((value) => {

			this.ngxLogger.debug('[NOTIFICATION] Permission value changed to:', value);

			if (value) {

				this.notificationService.requestPermissionAsync().then(() => {

					this.control.setValue(this.permissionIsGranted, {
						emitEvent: false,
						onlySelf: true,
					});

				})

			} else {

				this.notificationService.revokePermissionAsync().then(() => {

					this.control.setValue(this.permissionIsGranted, {
						emitEvent: false,
						onlySelf: true,
					});

				});

			}

		});

	}

}
