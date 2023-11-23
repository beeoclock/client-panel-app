import {Component, Input} from "@angular/core";
import {IAttendee} from "@event/domain";

@Component({
	selector: 'event-attendee-card-component',
	templateUrl: './attendee.card.component.html',
	standalone: true,
	imports: [],
})
export class AttendeeCardComponent {

	@Input()
	public attendee!: IAttendee;

	public get fullName(): string | null {

		if (!this.attendee?.customer) {
			return null;
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
