import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	HostBinding,
	inject,
	input,
	ViewEncapsulation
} from "@angular/core";

import {DatePipe} from "@angular/common";
import {Store} from "@ngxs/store";
import {OrderServiceStatusEnum} from "@tenant/order/order-service/domain/enum/order-service.status.enum";
import {EventActions} from "@tenant/event/infrastructure/state/event/event.actions";
import {
	AnybodySpecialistIconComponent
} from "@tenant/event/presentation/ui/page/calendar-with-specialists/v3/component/elements-on-calendar/icon/anybody-specialist.icon.component";
import {
	NoteIconComponent
} from "@tenant/event/presentation/ui/page/calendar-with-specialists/v3/component/elements-on-calendar/icon/note.icon.component";
import {
	OrderServiceStatusIconComponent
} from "@tenant/event/presentation/ui/page/calendar-with-specialists/v3/component/elements-on-calendar/icon/order-service-status-icon.component";
import {
	FirstTimeIconComponent
} from "@tenant/event/presentation/ui/page/calendar-with-specialists/v3/component/elements-on-calendar/icon/first-time.icon.component";
import {CustomerTypeEnum} from "@tenant/customer/domain/enum/customer-type.enum";
import {TranslateService} from "@ngx-translate/core";
import EOrderService from "@tenant/order/order-service/domain/entity/e.order-service";


@Component({
	selector: 'app-order-event-calendar-with-specialist-widget-component',
	template: `
		<div class="flex gap-1 items-center justify-between">
			<div class="text-xs dark:text-sky-100">
				{{ getAttendeesInformation() }}
			</div>
			<div class="flex gap-1">
				<app-first-time-icon-component
					[firstTime]="event().orderAppointmentDetails?.attendees?.[0]?.firstTime ?? false"/>
				<app-anybody-specialist-icon-component
					[wasSelectedAnybody]="event().orderAppointmentDetails?.specialists?.[0]?.wasSelectedAnybody ?? false"/>
				<app-note-icon-component [note]="event()?.customerNote ?? ''"/>
				<!--				<app-business-note-icon-component [businessNote]="event().order?.businessNote ?? ''"/>-->
				<app-order-service-status-icon-component [useDefaultStyle]="false" class="text-white"
														 [status]="event().status"/>
			</div>
		</div>
		<!--		<div class="text-xs font-bold dark:text-sky-100">-->
		<!--			{{ getAttendeesInformation() }}-->
		<!--		</div>-->
		<div class="text-xs font-medium">
			{{ event().serviceSnapshot.languageVersions[0].title }}
		</div>
		<div class="text-xs font-medium">
			{{ event().orderAppointmentDetails.start | date: 'HH:mm' }}
			- {{ event().orderAppointmentDetails.end | date: 'HH:mm' }}
		</div>
	`,
	standalone: true,
	imports: [
		DatePipe,
		AnybodySpecialistIconComponent,
		NoteIconComponent,
		OrderServiceStatusIconComponent,
		FirstTimeIconComponent,
	],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderEventCalendarWithSpecialistWidgetComponent {

	public readonly event = input.required<EOrderService>();

	public readonly useServiceColor = input(true);
	// Used by external components
	public readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
	public readonly orderServiceStatusEnum = OrderServiceStatusEnum;
	private readonly store = inject(Store);
	private readonly translateService = inject(TranslateService);

	public readonly anonymous = this.translateService.instant('keyword.capitalize.anonymous')

	@HostBinding('style.background-color')
	public get backgroundColor() {
		if (this.useServiceColor()) {
			const {presentation} = this.event().serviceSnapshot;
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

		if (this.useServiceColor()) {

			const {presentation} = this.event().serviceSnapshot;
			const {color} = presentation;
			if (color) {
				classList.push('text-white');
			} else {
				classList.push('text-black', 'bg-white', 'hover:bg-gray-200');
			}

		} else {

			classList.push('text-white');

			switch (this.event().status) {
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

	public async onClick() {
		const action = new EventActions.ToggleDetails(this.event()._id);
		this.store.dispatch(action);
	}

	public getAttendeesInformation() {
		return this.event().orderAppointmentDetails.attendees?.reduce((acc: string[], attendant) => {

			const {customer} = attendant;

			if (customer.customerType === CustomerTypeEnum.anonymous) {
				acc.push(this.anonymous);
				return acc;
			}

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

}
