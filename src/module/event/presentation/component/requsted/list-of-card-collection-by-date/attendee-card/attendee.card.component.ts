import {Component, inject, input} from "@angular/core";
import {IAttendee} from "@event/domain";
import {CustomerTypeEnum} from "@customer/domain/enum/customer-type.enum";
import {TranslateService} from "@ngx-translate/core";
import {IAttendeeDto} from "@order/external/interface/i-order-appointment-details.dto";

@Component({
	selector: 'event-attendee-card-component',
	templateUrl: './attendee.card.component.html',
	standalone: true,
	imports: [],
})
export class AttendeeCardComponent {

	public readonly attendee = input.required<IAttendee | IAttendeeDto>();

	private readonly translateService = inject(TranslateService);

	public get fullName(): string | null {

		const attendee = this.attendee();
		if (!attendee?.customer) {
			return null;
		}

		switch (attendee.customer.customerType) {
			case CustomerTypeEnum.anonymous:
				return this.translateService.instant('customer.enum.type.anonymous');

		}

		let fullName = null;

		if (attendee.customer.firstName) {
			fullName = attendee.customer.firstName;

			if (attendee.customer.lastName) {
				fullName += ' ' + attendee.customer.lastName;
			}

		}

		return fullName;

	}

	public get contact(): string | null {

		const attendee = this.attendee();
		if (!attendee?.customer) {
			return null;
		}

		let contact = null;

		if (attendee.customer.email) {
			contact = `
				<a class="underline" href="mailto:${attendee.customer.email}">
					${attendee.customer.email}
				</a>
			`;
		}

		if (attendee.customer.phone) {
			contact = `
				<a class="underline" href="tel:${attendee.customer.phone}">
					${attendee.customer.phone}
				</a>
			`;
		}

		return contact;

	}

}
