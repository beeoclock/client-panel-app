import {IBaseEntity} from "@utility/domain";
import {CustomerTypeEnum} from "../enum/customer-type.enum";
import {Tools} from "../../../shared/tools";
import {Types} from "../../../shared/types";
import IBaseItem from "../../../system/interface/i.base-item";
import Cursor from "@signaldb/core/Collection/Cursor";

export namespace ICustomer {

	export interface DTO extends IBaseEntity<'CustomerDto'> {
		firstName: string & Types.MaxLength<50> | null;
		lastName: string & Types.MaxLength<50> | null;
		phone: string | "" | null;
		email: string & Types.Email | null;
		note: string | null;
		customerType: CustomerTypeEnum & Types.Default<CustomerTypeEnum.new>;
	}

	export interface Entity extends IBaseItem<'CustomerDto', DTO>, DTO {

		getNamesake(): Cursor<ICustomer.Entity, ICustomer.Entity>;

		// TODO: add key in base entity to know if entity synced and when it was synced

		// TODO: getOrders
		// TODO: getFavoriteSpecialist
		// TODO: getFavoriteService
		// TODO: getFavoriteProduct
		// TODO: getSpecialistData - when customer is also as specialist

	}

}

export const isCustomer = Tools.createIs<ICustomer.DTO>();
export const validCustomer = Tools.createValidate<ICustomer.DTO>();
export const randomCustomer = Tools.createRandom<ICustomer.DTO>();
