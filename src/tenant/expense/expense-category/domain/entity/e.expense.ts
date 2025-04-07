import {CustomerTypeEnum} from "@tenant/customer/domain/enum/customer-type.enum";
import {ICustomer} from "@tenant/customer/domain";
import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {IExpense} from "@tenant/expense/expense/domain";


export class EExpense extends ABaseEntity<'ExpenseDto', IExpense.DTO, IExpense.EntityRaw> implements IExpense.EntityRaw {

	override object = 'ExpenseDto' as const;

	// TODO

	public override toDTO(): ICustomer.DTO {
		return EExpense.toDTO(this);
	}

	public static toDTO(data: ICustomer.EntityRaw): ICustomer.DTO {
		return {
			_id: data._id,
			createdAt: data.createdAt,
			customerType: data.customerType,
			email: data.email,
			firstName: data.firstName,
			lastName: data.lastName,
			note: data.note,
			object: data.object,
			phone: data.phone,
			state: data.state,
			stateHistory: data.stateHistory,
			updatedAt: data.updatedAt,
		};
	}

	/**
	 * Use it to create new entity, e.g. from API or form
	 * @param data
	 */
	public static fromDTO(data: ICustomer.DTO): EExpense {
		return new EExpense(data);
	}

	/**
	 * Use it to create entity from raw data, e.g. from database
	 * @param data
	 */
	public static fromRaw(data: ICustomer.EntityRaw): EExpense {
		return new EExpense(data);
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

export default EExpense;
