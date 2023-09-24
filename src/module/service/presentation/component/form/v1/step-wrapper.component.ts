import {Component, Input} from "@angular/core";
import {NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {ServicesFormComponent} from "@service/presentation/component/form/v1/service/services.form.component";
import {DurationsFormComponent} from "@service/presentation/component/form/v1/duration/durations.form.component";
import {ServiceForm} from "@service/presentation/form/service.form";
import {MembersFormComponent} from "@service/presentation/component/form/v1/members/members.form.component";
import {SchedulesFormComponent} from "@utility/presentation/component/schedule/schedules.form.component";

@Component({
	selector: 'service-form-step-wrapper-component',
	standalone: true,
	imports: [
		NgSwitch,
		NgSwitchCase,
		ServicesFormComponent,
		DurationsFormComponent,
		MembersFormComponent,
		NgIf,
		MembersFormComponent,
		SchedulesFormComponent
	],
	template: `

		<ng-container *ngIf="isActive" [ngSwitch]="section">

			<service-services-form-component
				*ngSwitchCase="'services'"
				(handlePushNewLanguageVersionForm)="form.pushNewLanguageVersionForm()"
				[form]="form.controls.languageVersions"/>

			<service-durations-form-component
				*ngSwitchCase="'durations'"
				[durationVersionsForm]="form.controls.durationVersions"/>

			<schedules-form-component
				*ngSwitchCase="'schedules'"
				[schedulesForm]="form.controls.schedules"/>

			<service-members-form-component
				*ngSwitchCase="'members'"
				[control]="form.controls.specialists"/>

		</ng-container>

	`
})
export class StepWrapperComponent {

	@Input()
	public section: 'services' | 'durations' | 'schedules' | 'members' = 'services';

	@Input()
	public form!: ServiceForm;

	@Input()
	public isActive = false;

	public get information(): {
		title: string;
		description: string;
	} {
		return {
			services: {
				title: 'Languages',
				description: 'Set language versions of service'
			},
			durations: {
				title: 'Durations',
				description: 'Set duration versions of service'
			},
			schedules: {
				title: 'Schedules',
				description: 'Set schedule versions of service'
			},
			members: {
				title: 'Members',
				description: 'Set permanent members of service'
			},
		}[this.section];
	}

}
