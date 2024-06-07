import {Component, EventEmitter, inject, Input, Output} from "@angular/core";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslateModule} from "@ngx-translate/core";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {EditLinkComponent} from "@utility/presentation/component/link/edit.link.component";
import {NgIf, NgTemplateOutlet} from "@angular/common";
import {EventStatusEnum} from "@src/module/utility/domain/enum/event-status.enum";
import {NGXLogger} from "ngx-logger";
import {IEvent_V2} from "@event/domain";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";

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
	public event!: IEvent_V2<{ order: IOrderDto; service: IOrderServiceDto; }>;

	@Output()
	public readonly statusChange = new EventEmitter<void>();

	public readonly ngxLogger = inject(NGXLogger);
	public readonly router = inject(Router);
	public readonly activatedRoute = inject(ActivatedRoute);

	public readonly loading = new BooleanStreamState(false);

	protected postStatusChange(newStatus: EventStatusEnum): void {
		this.ngxLogger.debug(`postStatusChange: ${newStatus}`);
		const {action, from, redirectUri} = this.activatedRoute.snapshot.queryParams;
		this.ngxLogger.debug(`action: ${action}, from: ${from}, redirectUri: ${redirectUri}`);
		if (redirectUri) {
			this.router.navigate([redirectUri ?? '/']).then();
		}
	}

}
