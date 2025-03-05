import {Component, inject, input, OnChanges, output, SimpleChange, SimpleChanges} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {NGXLogger} from "ngx-logger";
import {IEvent_V2} from "@event/domain";
import {IOrder} from "@core/business-logic/order/interface/i.order";
import {IOrderServiceDto} from "@core/business-logic/order/interface/i.order-service.dto";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";

@Component({
	selector: 'event-change-status-base-component',
	standalone: true,
	imports: [
		TranslateModule,
	],
	template: `
	`
})
export abstract class ChangeStatusBaseComponent implements OnChanges {

	public readonly event = input.required<IEvent_V2<{
		order: IOrder.DTO;
		service: IOrderServiceDto;
	}>>();

	public readonly statusChange = output<void>();

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
