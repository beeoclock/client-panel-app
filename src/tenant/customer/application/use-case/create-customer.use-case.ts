import {SharedUow} from "@core/shared/uow/shared.uow";
import ECustomer from "@tenant/customer/domain/entity/e.customer";
import {ICustomer} from "@tenant/customer/domain";

export class CreateCustomerUseCase {

	public constructor(
		private readonly sharedUow: SharedUow,
		private readonly payload: ICustomer.EntityRaw,
	) {
	}

	public async execute() {

		const customer = ECustomer.fromRaw(this.payload);

		// Find the customer by email
		const existingCustomer = await this.sharedUow.customer.findOneByEmailPhone({
			email: customer.email,
			phone: customer.phone,
		});

		if (existingCustomer) {
			throw new Error(`Customer with email ${customer.email} or phone ${customer.phone} already exists.`);
		}

		await this.sharedUow.customer.repository.createAsync(customer);

	}

}
