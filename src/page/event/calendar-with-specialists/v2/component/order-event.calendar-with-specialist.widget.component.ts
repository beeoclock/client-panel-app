import {ChangeDetectionStrategy, Component, HostBinding, inject, Input, ViewEncapsulation} from "@angular/core";

import {IAttendee, IEvent_V2} from "@event/domain";
import {DatePipe, NgIf} from "@angular/common";
import {Store} from "@ngxs/store";
import {EventActions} from "@event/state/event/event.actions";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";
import {OrderServiceStatusEnum} from "@order/domain/enum/order-service.status.enum";

@Component({
	selector: 'app-order-event-calendar-with-specialist-widget-component',
	template: `
		<div class="flex flex-wrap gap-1">
			<span class="text-xs dark:text-sky-100">
				{{ event.start | date: 'HH:mm' }} - {{ event.end | date: 'HH:mm' }}
			</span>
			<span class="text-xs font-bold dark:text-sky-100">
				{{ getAttendeesInformation() }}
			</span>
		</div>
		<div class="text-xs font-medium">
			{{ event.originalData.service.serviceSnapshot.languageVersions[0].title }}
		</div>
		<div *ngIf="event.note" class="text-xs font-medium">
			📓 {{ event.note }}
		</div>
	`,
	standalone: true,
	imports: [
		DatePipe,
		NgIf
	],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderEventCalendarWithSpecialistWidgetComponent {

	@Input()
	public event!: IEvent_V2<{ order: IOrderDto; service: IOrderServiceDto; }>;

	private readonly store = inject(Store);


	public async onClick() {
		await this.openEventDetails(this.event);
	}

	@HostBinding('class')
	public get class() {

		// Choose color by status
		const classList = [
			'absolute top-0 bottom-0 left-0 right-0 text-white border-2',
			'transition-all cursor-pointer rounded-md border-[#00000038] p-1 flex flex-col overflow-hidden',
		];

		const {service} = this.event.originalData;
		switch (service.status) {
			case OrderServiceStatusEnum.rejected:
			case OrderServiceStatusEnum.cancelled:
				classList.push('bg-red-400', 'hover:bg-red-500'); // 'border-red-400',
				break;
			case OrderServiceStatusEnum.requested:
				classList.push('bg-orange-400', 'hover:bg-orange-500'); // 'border-orange-500',
				break;
			case OrderServiceStatusEnum.accepted:
				classList.push('bg-blue-400', 'hover:bg-blue-500'); // 'border-blue-400',
				break;
			case OrderServiceStatusEnum.done:
				classList.push('bg-green-500', 'hover:bg-green-600'); // 'border-green-500',
				break;
			case OrderServiceStatusEnum.pending:
				classList.push('bg-yellow-500', 'hover:bg-yellow-600'); // 'border-yellow-500',
				break;
		}

		return classList.join(' ');
	}

	public getAttendeesInformation() {
		return this.event.attendees?.map((attendant) => {
			if (attendant.is !== 'customer') {
				return;
			}

			const {customer} = attendant.originalData as IAttendee;

			if (customer?.firstName) {
				return customer?.firstName;
			}
			if (customer?.phone) {
				return customer?.phone;
			}
			if (customer?.email) {
				return customer?.email;
			}
			return '';
		}).join(', ');
	}

	private async openEventDetails(event: IEvent_V2<{ order: IOrderDto; service: IOrderServiceDto; }>) {

		this.store.dispatch(new EventActions.OpenDetails(event));
	}

}
