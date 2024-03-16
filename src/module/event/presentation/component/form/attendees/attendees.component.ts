import {Component, inject, Input} from '@angular/core';
import {AttendantComponent} from '@event/presentation/component/form/attendees/attendant/attendant.component';
import {NgForOf, NgIf} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {AttendeesForm} from "@event/presentation/form/attendant.form";
import {PrimaryLinkButtonDirective} from "@utility/presentation/directives/button/primary.link.button.directive";
import {
	ModalSelectCustomerService
} from "@utility/presentation/component/modal-select-customer/modal-select-customer.service";

@Component({
	selector: 'event-attendees-component',
	templateUrl: './attendees.component.html',
	standalone: true,
	imports: [
		AttendeesComponent,
		AttendantComponent,
		NgForOf,
		TranslateModule,
		NgIf,
		PrimaryLinkButtonDirective
	],
})
export class AttendeesComponent {

	@Input()
	public form!: AttendeesForm;

	private readonly modalSelectCustomerService = inject(ModalSelectCustomerService);

	public remove(index: number): void {

		this.form.removeAt(index);

		if (this.form.controls.length === 0) {
			this.form.pushNewOne();
		}

	}

	public selectCustomer() {

		this.modalSelectCustomerService.openCustomerModal({
			multiSelect: false,
			selectedServiceList: []
		}).then((customers) => {

			this.form.controls[0].patchValue({
				customer: customers[0]
			});
			this.form.controls[0].controls.customer.disable();

		});

	}

}
