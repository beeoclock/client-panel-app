import {Component, EventEmitter, inject, input, OnChanges, Output, SimpleChange, SimpleChanges} from "@angular/core";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslateModule} from "@ngx-translate/core";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {EditLinkComponent} from "@utility/presentation/component/link/edit.link.component";
import {NgIf, NgTemplateOutlet} from "@angular/common";
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
export abstract class ChangeStatusBaseComponent implements OnChanges {

	public readonly event = input.required<IEvent_V2<{
    order: IOrderDto;
    service: IOrderServiceDto;
}>>();

	@Output()
	public readonly statusChange = new EventEmitter<void>();

	public ngOnChanges(changes: SimpleChanges & { event: SimpleChange }) {
		if (changes.event) {
			this.loading.doFalse();
		}
	}

	public readonly ngxLogger = inject(NGXLogger);
	public readonly router = inject(Router);
	public readonly activatedRoute = inject(ActivatedRoute);

	public readonly loading = new BooleanStreamState(false);

}
