import {CustomerTypeEnum} from "@tenant/customer/domain/enum/customer-type.enum";
import {Types} from "@core/shared/types";
import {ICustomer} from "@tenant/customer/domain";
import {ABaseEntity} from "@core/system/abstract/a.base-entity";


export class ECustomer extends ABaseEntity<'CustomerDto', ICustomer.DTO, ICustomer.EntityRaw> implements ICustomer.EntityRaw {

	override object = 'CustomerDto' as const;

	firstName!: (string & Types.MaxLength<50>) | null;
	lastName!: (string & Types.MaxLength<50>) | null;
	phone!: string | null;
	email!: (string & Types.Email) | null;
	note!: string | null;
	customerType!: CustomerTypeEnum & Types.Default<CustomerTypeEnum.new>;

	public override toDTO(): ICustomer.DTO {
		return ECustomer.toDTO(this);
	}

	public static toDTO(data: ICustomer.EntityRaw): ICustomer.DTO {
		return {
			customerType: data.customerType,
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			phone: data.phone,
			note: data.note,

			_id: data._id,
			state: data.state,
			object: data.object,
			_version: data._version,
			updatedAt: data.updatedAt,
			createdAt: data.createdAt,
			stateHistory: data.stateHistory,
		};
	}

	/**
	 * Use it to create new entity, e.g. from API or form
	 * @param data
	 */
	public static fromDTO(data: ICustomer.DTO): ECustomer {
		return new ECustomer(data);
	}

	/**
	 * Use it to create entity from raw data, e.g. from database
	 * @param data
	 */
	public static fromRaw(data: ICustomer.EntityRaw): ECustomer {
		return new ECustomer(data);
	}

	/**
	 * Tools
	 */

	// public static readonly is = {
	// 	dto: Tools.createIs<ICustomer.DTO>(),
	// 	entity: Tools.createIs<ICustomer.Entity>(),
	// };
	// public static readonly isValid = {
	// 	dto: Tools.createValidate<ICustomer.DTO>(),
	// 	entity: Tools.createValidate<ICustomer.Entity>(),
	// };
	// public static readonly getRandom = {
	// 	dto: Tools.createRandom<ICustomer.DTO>(),
	// 	entity: Tools.createRandom<ICustomer.Entity>(),
	// };

	public static isEqual(...customers: ICustomer.DTO[]): boolean {
		if (customers.length < 2) {
			throw new Error('At least 2 customers are required to compare');
		}
		const item = customers[0];
		return customers.every((customer, index) => {
			if (index === 0) {
				return true;
			}
			if (item.customerType !== customer.customerType) {
				return false;
			}
			switch (customer.customerType) {
				case CustomerTypeEnum.anonymous:
				case CustomerTypeEnum.new:
					return true;
				case CustomerTypeEnum.regular:
					return item._id === customer._id;
				case CustomerTypeEnum.unregistered:
					return item.firstName === customer.firstName && item.lastName === customer.lastName;
				default:
					throw new Error(`Unknown customer type: ${customer.customerType}`);

			}
		});
	}
}

export default ECustomer;
