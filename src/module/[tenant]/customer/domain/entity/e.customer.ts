import {ABaseItem} from "@core/abstract/a.base-item";
import {Tools} from "@utility/tools";
import {CustomerTypeEnum} from "@customer/domain/enum/customer-type.enum";
import {Types} from "@utility/types";
import {ICustomer} from "@customer/domain";
import {ActiveEnum} from "@utility/domain/enum";


export class ECustomer extends ABaseItem<'CustomerDto', ICustomer.DTO> implements ICustomer.Entity {

	firstName!: (string & Types.MaxLength<50>) | null;
	lastName!: (string & Types.MaxLength<50>) | null;
	phone!: string | null;
	email!: (string & Types.Email) | null;
	note!: string | null;
	customerType!: CustomerTypeEnum & Types.Default<CustomerTypeEnum.new>;
	active!: ActiveEnum;

	// Implement to find customer with the same lastName
	public getNamesake() {
		const {lastName, id} = this;
		// Not me but with the same lastName
		console.log('namesakes', {lastName})
		return ECustomer.database.find({
			lastName,
			_id: {
				$ne: id,
			},
		})
	}

	public override toDTO(): ICustomer.DTO {
		return ECustomer.toDTO(this);
	}

	public static toDTO(data: ICustomer.Entity): ICustomer.DTO {
		const {id, ...rest} = data;
		return rest;
	}

	/**
	 * Use it to create new entity, e.g. from API or form
	 * @param data
	 */
	public static create(data: ICustomer.DTO): ICustomer.Entity {
		return new ECustomer(data);
	}

	/**
	 * Tools
	 */

	public static readonly is = {
		dto: Tools.createIs<ICustomer.DTO>(),
		entity: Tools.createIs<ICustomer.Entity>(),
	};
	public static readonly isValid = {
		dto: Tools.createValidate<ICustomer.DTO>(),
		entity: Tools.createValidate<ICustomer.Entity>(),
	};
	public static readonly getRandom = {
		dto: Tools.createRandom<ICustomer.DTO>(),
		entity: Tools.createRandom<ICustomer.Entity>(),
	};

}

syncManagerConfigurationRegister.push(ECustomer.getSyncConfiguration.bind(ECustomer) as never);

export default ECustomer;
