import {Component, effect, inject, input, OnInit, ViewEncapsulation} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {ICustomer, randomCustomer} from '@customer/domain';
import {Store} from "@ngxs/store";
import {CustomerActions} from "@customer/state/customer/customer.actions";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslateModule} from "@ngx-translate/core";
import {DeleteButtonComponent} from "@utility/presentation/component/button/delete.button.component";
import {EditButtonComponent} from "@utility/presentation/component/button/edit.button.component";
import {ActiveStyleDirective} from "@utility/presentation/directives/active-style/active-style.directive";
import {
	CustomerOrderListExternalWhacAMole
} from "@order/presentation/component/external/case/customer/list/customer.order.list.external.whac-a-mole";
import {PrimaryLinkStyleDirective} from "@utility/presentation/directives/link/primary.link.style.directive";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {CustomerTenantDatabaseService} from "@customer/database/tenant/customer.tenant.database.service";
import {Customers} from "@src/database/tenant/signaldb/tenant.signaldb.database";
import ObjectID from "bson-objectid";

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
		PrimaryLinkStyleDirective
	],
    standalone: true
})
export class CustomerDetailsContainerComponent implements OnInit {

    // TODO add base index of details with store and delete method

    public readonly item = input.required<ICustomer>();

	public readonly customerTenantDatabaseService = inject(CustomerTenantDatabaseService)
    public readonly store = inject(Store);
    public readonly customerOrderListExternalWhacAMole = inject(CustomerOrderListExternalWhacAMole);

	public ngOnInit() {
		this.customerTenantDatabaseService.get(this.item()._id).then((customer) => {
			console.log({customer});
		})

		setTimeout(() => {
			// const id = new ObjectID().toHexString();
			// console.log({id})
			Customers.insert(randomCustomer());
			// Posts.insert({
			// 	id: new ObjectID().toHexString(),
			// 	authorId: id,
			// 	title: 'Hello world',
			// 	content: 'Hello world content',
			// 	createdAt: new Date().toISOString(),
			// });
		}, 10_000);
	}

	public constructor() {

		const customers = Customers.find().fetch();
		console.log('0;', customers);
		effect(() => {
			const customers = Customers.find().fetch();
			console.log('1:', customers);
			// console.log(posts[0].getAuthor());
		});
	}

	public async delete(customer: ICustomer) {

        const {active} = customer;

        if (active) {

            return alert('You can\'t delete active customer');

        }

        await firstValueFrom(this.store.dispatch(new CustomerActions.DeleteItem(customer._id)));

    }

	@Dispatch()
    public openForm() {
        const item = this.item();
        if (!item) {
            return
        }
        return new CustomerActions.OpenFormToEditById(item?._id);
    }

    public async openCustomersOrders() {
        await this.customerOrderListExternalWhacAMole.execute(this.item()._id);
    }
}
