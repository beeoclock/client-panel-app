import {Component, effect, inject, input, OnInit, ViewEncapsulation} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {ICustomer} from '@customer/domain';
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

	// public readonly customerTenantDatabaseService = inject(CustomerTenantDatabaseService)
	public readonly store = inject(Store);
	public readonly customerOrderListExternalWhacAMole = inject(CustomerOrderListExternalWhacAMole);

	public ngOnInit() {
		// this.customerTenantDatabaseService.get(this.item()._id).then((customer) => {
		// 	console.log({customer});
		// });
		// this.customerTenantDatabaseService.db().customer.where('data.active').equals(ActiveEnum.YES).toArray().then((customers) => {
		// 	console.log({customers});
		// });

		// const findId = '6794d056e3f23d13dff0026f';

		// const id = new ObjectID().toHexString();
		// const dateISO = new Date().toISOString();
		// const item = Customer.create({
		// 	object: "CustomerDto",
		// 	email: "jan.kowalski@example.com",
		// 	firstName: "Jan",
		// 	lastName: "Kowalski",
		// 	customerType: CustomerTypeEnum.new,
		// 	phone: "48999999999",
		// 	active: ActiveEnum.YES,
		// 	note: "Check SignalDB!",
		// 	createdAt: dateISO,
		// 	updatedAt: dateISO,
		// 	_id: id,
		// });
		//
		// console.log('SignalDB:findOne:children', Customers.findOne({
		// 	'children.0.active': ActiveEnum.YES
		// }));
		//
		// console.log('SignalDB:findOne:children', Customers.findOne({
		// 	active: ActiveEnum.YES
		// }));
		//
		// console.log('SignalDB:findOne:children:$elemMatch', Customers.findOne({
		// 	'child.active': ActiveEnum.YES
		// }));
		//
		// console.log('SignalDB:findOne:child', Customers.findOne({
		// 	'child.active': ActiveEnum.YES
		// }));

		// setTimeout(() => {
		// 	const result = Customers.find().fetch();
		// 	console.log('SignalDB:', {result});
		//
		// 	const newId = Customers.insert(item);
		// 	// Posts.insert({
		// 	// 	id: new ObjectID().toHexString(),
		// 	// 	authorId: id,
		// 	// 	title: 'Hello world',
		// 	// 	content: 'Hello world content',
		// 	// 	createdAt: new Date().toISOString(),
		// 	// });
		//
		// 	console.log('SignalDB:insert', {newId});
		//
		// }, 5_000);
		//
		// setTimeout(() => {
		// 	const foundItem = Customers.findOne({
		// 		_id: findId
		// 	});
		// 	console.log('SignalDB:findOne', {foundItem});
		//
		// 	console.log('SignalDB:removeOne:tryToRemove', {findId});
		// 	if (foundItem) {
		// 		const result = Customers.removeOne({
		// 			_id: findId
		// 		});
		// 		console.log('SignalDB:removeOne', {result});
		// 	}
		// }, 20_000);
	}

	public constructor() {

		// const customers = Customers.find().fetch();
		// console.log('0;', customers);
		effect(() => {
			// const customers = Customers.find().fetch();
			// console.log('1:', customers);
			// console.log(posts[0].getAuthor());
		});

		effect((onCleanup) => {
			// const cursor = Customers.find({firstName: 'Mark'});
			// console.log(cursor.count())
			onCleanup(() => {
				// cursor.cleanup()
			})
		})
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
