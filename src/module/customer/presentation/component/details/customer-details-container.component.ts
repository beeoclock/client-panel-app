import {Component, inject, Input, ViewEncapsulation} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {ICustomer} from '@customer/domain';
import {Store} from "@ngxs/store";
import {CustomerActions} from "@customer/state/customer/customer.actions";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslateModule} from "@ngx-translate/core";
import {DeleteButtonComponent} from "@utility/presentation/component/button/delete.button.component";
import {EditButtonComponent} from "@utility/presentation/component/button/edit.button.component";
import {ActiveStyleDirective} from "@utility/presentation/directives/active-style/active-style.directive";
import {NgIf} from "@angular/common";

@Component({
	selector: 'customer-detail-page',
	templateUrl: './customer-details-container.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		DynamicDatePipe,
		TranslateModule,
		DeleteButtonComponent,
		EditButtonComponent,
		ActiveStyleDirective,
		NgIf
	],
	standalone: true
})
export class CustomerDetailsContainerComponent {

	// TODO add base index of details with store and delete method

	@Input()
	public item!: ICustomer;

	public readonly store = inject(Store);

	public async delete(customer: ICustomer) {

		const {active} = customer;

		if (active) {

			return alert('You can\'t delete active customer');

		}

		await firstValueFrom(this.store.dispatch(new CustomerActions.DeleteItem(customer._id)));

	}

	public openForm() {
		if (!this.item) {
			return
		}
		this.store.dispatch(new CustomerActions.OpenFormToEditById(this.item?._id));
	}

}
