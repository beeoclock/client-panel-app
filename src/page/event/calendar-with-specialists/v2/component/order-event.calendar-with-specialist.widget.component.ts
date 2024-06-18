import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	HostBinding,
	inject,
	Input,
	ViewEncapsulation
} from "@angular/core";

import {IAttendee, IEvent_V2} from "@event/domain";
import {DatePipe, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {Store} from "@ngxs/store";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";
import {OrderServiceStatusEnum} from "@order/domain/enum/order-service.status.enum";
import {EventActions} from "@event/state/event/event.actions";

@Component({
	selector: 'app-order-event-calendar-with-specialist-widget-component',
	template: `
		<div class="flex gap-1 items-center justify-between">
			<div class="text-xs dark:text-sky-100">
				{{ event.start | date: 'HH:mm' }} - {{ event.end | date: 'HH:mm' }}
			</div>
			<ng-container [ngSwitch]="event.originalData.service.status">
				<i *ngSwitchCase="orderServiceStatusEnum.done" class="bi bi-check2-all"></i>
				<i *ngSwitchCase="orderServiceStatusEnum.cancelled" class="bi bi-x"></i>
				<i *ngSwitchCase="orderServiceStatusEnum.rejected" class="bi bi-x"></i>
				<i *ngSwitchCase="orderServiceStatusEnum.accepted" class="bi bi-check2"></i>
				<i *ngSwitchCase="orderServiceStatusEnum.inProgress" class="bi bi-hourglass-split"></i>
				<i *ngSwitchCase="orderServiceStatusEnum.requested" class="bi bi-exclamation"></i>
			</ng-container>
		</div>
		<div class="text-xs font-bold dark:text-sky-100">
				{{ getAttendeesInformation() }}
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
		NgIf,
		NgSwitch,
		NgSwitchCase
	],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderEventCalendarWithSpecialistWidgetComponent {

	@Input()
	public event!: IEvent_V2<{ order: IOrderDto; service: IOrderServiceDto; }>;

	@Input() // TODO: Add settings for calendar to switch from service color to status color
	public useServiceColor = true;

	private readonly store = inject(Store);
	public readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

	public readonly orderServiceStatusEnum = OrderServiceStatusEnum;

	public async onClick() {
		await this.openEventDetails(this.event);
	}

	@HostBinding('style.background-color')
	public get backgroundColor() {
		if (this.useServiceColor) {
			const {service} = this.event.originalData;
			const {presentation} = service.serviceSnapshot;
			const {color} = presentation;
			if (color) {
				return color;
			}
		}
		return 'default';
	}

	@HostBinding('class')
	public get class() {

		// Choose color by status
		const classList = [
			'absolute top-0 bottom-0 left-0 right-0 border-2',
			'transition-all cursor-pointer rounded-md border-[#00000038] px-1 flex flex-col overflow-hidden',
		];

		const {service} = this.event.originalData;

		if (this.useServiceColor) {

			const {presentation} = service.serviceSnapshot;
			const {color} = presentation;
			if (color) {
				classList.push('text-white');
			} else {
				classList.push('text-black', 'bg-white', 'hover:bg-gray-200');
			}

		} else {

			classList.push('text-white');

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
				case OrderServiceStatusEnum.inProgress:
					classList.push('bg-yellow-500', 'hover:bg-yellow-600'); // 'border-yellow-500',
					break;
			}

		}

		return classList.join(' ');
	}

	public getAttendeesInformation() {
		return this.event.attendees?.reduce((acc: string[], attendant) => {
			if (attendant.is !== 'customer') {
				return acc;
			}

			const {customer} = attendant.originalData as IAttendee;

			switch (true) {
				case !!customer?.firstName && !!customer?.lastName:
					acc.push(`${customer?.firstName} ${customer?.lastName}`);
					return acc;
				case !!customer?.firstName:
					acc.push(customer?.firstName);
					return acc;
				case !!customer?.email:
					acc.push(customer?.email);
					return acc;
				case !!customer?.phone:
					acc.push(customer?.phone);
					return acc;
			}

			return acc;

		}, [] as string[]).join(', ');
	}

	private async openEventDetails(event: IEvent_V2<{ order: IOrderDto; service: IOrderServiceDto; }>) {
		this.store.dispatch(new EventActions.OpenDetails(event));
	}

}
