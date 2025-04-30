import {ICustomer} from "@tenant/customer/domain";
import {BaseService} from "@core/shared/service/base.service";

type ENTITY_RAW = ICustomer.EntityRaw;

export class CustomerService extends BaseService<ENTITY_RAW> {

	public async findOneByEmailPhone(either: {
		email?: string | null;
		phone?: string | null;
	}) {
		if (either?.email && either.email.length > 0) {
			const customer = await this.fundOneByEmail(either.email);
			if (customer) return customer;
		}

		if (either?.phone && either.phone.length > 0) {
			// Find by phone
			const customer = await this.fundOneByPhone(either.phone);
			if (customer) return customer;
		}

		return null;
	}

	public async fundOneByEmail(email: string) {
		// Find by email
		return this.db.where('email').equals(email).first();
	}

	public async fundOneByPhone(phone: string) {
		// Find by email
		return this.db.where('phone').equals(phone).first();
	}

	// public async findByEither(either: {
	// 	email?: string;
	// 	phone?: string;
	// }) {
	// 	const keys = Object.keys(either);
	// 	const values = Object.values(either);
	// 	// const customers = await this.db
	// 	// 	.where(`[${keys.join('+')}]`)
	// 	// 	.anyOf([values, ])
	// 	// 	.toArray();
	//
	// 	return customers;
	// }

}
