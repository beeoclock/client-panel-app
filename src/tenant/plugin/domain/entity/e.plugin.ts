import {CustomerTypeEnum} from "@tenant/customer/domain/enum/customer-type.enum";
import {Types} from "@core/shared/types";
import {ICustomer} from "@tenant/customer/domain";
import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {IPlugin} from "@tenant/plugin/domain";


export class EPlugin extends ABaseEntity<'PluginDto', IPlugin.DTO, IPlugin.EntityRaw> implements IPlugin.EntityRaw {

	override object = 'PluginDto' as const;

	firstName!: (string & Types.MaxLength<50>) | null;
	lastName!: (string & Types.MaxLength<50>) | null;
	phone!: string | null;
	email!: (string & Types.Email) | null;
	note!: string | null;
	customerType!: CustomerTypeEnum & Types.Default<CustomerTypeEnum.new>;

	public override toDTO(): ICustomer.DTO {
		return EPlugin.toDTO(this);
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
	public static fromDTO(data: ICustomer.DTO): EPlugin {
		return new EPlugin(data);
	}

	/**
	 * Use it to create entity from raw data, e.g. from database
	 * @param data
	 */
	public static fromRaw(data: ICustomer.EntityRaw): EPlugin {
		return new EPlugin(data);
	}

}

export default EPlugin;
