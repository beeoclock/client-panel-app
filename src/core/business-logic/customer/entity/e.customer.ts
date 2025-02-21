import {CustomerTypeEnum} from "@core/business-logic/customer/enum/customer-type.enum";
import {Types} from "@core/shared/types";
import {ICustomer} from "@core/business-logic/customer";
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

}

export default ECustomer;
