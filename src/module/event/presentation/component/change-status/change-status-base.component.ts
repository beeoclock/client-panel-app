import {Component, inject, Input} from "@angular/core";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslateModule} from "@ngx-translate/core";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {EditLinkComponent} from "@utility/presentation/component/link/edit.link.component";
import {NgIf, NgTemplateOutlet} from "@angular/common";
import {EventStatusEnum} from "@src/module/utility/domain/enum/event-status.enum";
import {NGXLogger} from "ngx-logger";
import {RMIEvent} from "@event/domain";

@Component({
	selector: 'event-change-status-base-component',
	standalone: true,
	imports: [
		DynamicDatePipe,
		TranslateModule,
		RouterLink,
		EditLinkComponent,
		NgIf,
		NgTemplateOutlet
	],
	template: `
	`
})
export abstract class ChangeStatusBaseComponent {

	@Input({required: true})
	public event!: RMIEvent;

	public readonly logger = inject(NGXLogger);
	public readonly router = inject(Router);
	public readonly activatedRoute = inject(ActivatedRoute);

	protected postStatusChange(newStatus: EventStatusEnum): void {
		this.logger.debug(`postStatusChange: ${newStatus}`);
		const {action, from, redirectUri} = this.activatedRoute.snapshot.queryParams;
		this.logger.debug(`action: ${action}, from: ${from}, redirectUri: ${redirectUri}`);
		if (redirectUri) {
			this.router.navigate([redirectUri ?? '/']).then();
		}
	}

}
