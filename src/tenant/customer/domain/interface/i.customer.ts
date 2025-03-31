import {IBaseDTO, IBaseEntityRaw} from "@shared/domain";
import {CustomerTypeEnum} from "@tenant/customer/domain/enum/customer-type.enum";
import {Tools} from "@core/shared/tools";
import {Types} from "@core/shared/types";

export namespace ICustomer {

	export interface DTO extends IBaseDTO<'CustomerDto'> {
		firstName: string & Types.MaxLength<50> | null;
		lastName: string & Types.MaxLength<50> | null;
		phone: string | "" | null;
		email: string & Types.Email | null;
		note: string | null;
		customerType: CustomerTypeEnum & Types.Default<CustomerTypeEnum.new>;
	}

	export type EntityRaw = IBaseEntityRaw<'CustomerDto'> & DTO &
	{

		// TODO: add key in base entity to know if entity synced and when it was synced

		// TODO: getOrders
		// TODO: getFavoriteSpecialist
		// TODO: getFavoriteService
		// TODO: getFavoriteProduct
		// TODO: getSpecialistData - when customer is also as specialist

	};

}

export const isCustomer = Tools.createIs<ICustomer.DTO>();
export const validCustomer = Tools.createValidate<ICustomer.DTO>();
export const randomCustomer = Tools.createRandom<ICustomer.DTO>();
