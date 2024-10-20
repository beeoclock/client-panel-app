import {Component, inject, Input} from "@angular/core";
import {IAttendee} from "@event/domain";
import {CustomerTypeEnum} from "@customer/domain/enum/customer-type.enum";
import {TranslateService} from "@ngx-translate/core";
import {IAttendeeDto} from "@order/external/interface/i-order-appointment-details.dto";
import {IconComponent} from "@src/component/adapter/icon/icon.component";

@Component({
	selector: 'event-attendee-card-component',
	templateUrl: './attendee.card.component.html',
	standalone: true,
	imports: [
		IconComponent
	],
})
export class AttendeeCardComponent {

	@Input()
	public attendee!: IAttendee | IAttendeeDto;

	private readonly translateService = inject(TranslateService);

	public get fullName(): string | null {

		if (!this.attendee?.customer) {
			return null;
		}

		switch (this.attendee.customer.customerType) {
			case CustomerTypeEnum.anonymous:
				return this.translateService.instant('customer.enum.type.anonymous');

		}

		let fullName = null;

		if (this.attendee.customer.firstName) {
			fullName = this.attendee.customer.firstName;

			if (this.attendee.customer.lastName) {
				fullName += ' ' + this.attendee.customer.lastName;
			}

		}

		return fullName;

	}

	public get contact(): string | null {

		if (!this.attendee?.customer) {
			return null;
		}

		let contact = null;

		if (this.attendee.customer.email) {
			contact = `
				<a class="underline" href="mailto:${this.attendee.customer.email}">
					${this.attendee.customer.email}
				</a>
			`;
		}

		if (this.attendee.customer.phone) {
			contact = `
				<a class="underline" href="tel:${this.attendee.customer.phone}">
					${this.attendee.customer.phone}
				</a>
			`;
		}

		return contact;

	}

}
