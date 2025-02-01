import {Enum, IBaseEntity} from "@utility/domain";
import {Types} from "@utility/types";
import {CustomerTypeEnum} from "@customer/domain/enum/customer-type.enum";
import IBaseItem from "@core/interface/i.base-item";
import Cursor from "@signaldb/core/Collection/Cursor";

export namespace ICustomer {

	export interface DTO extends IBaseEntity<'CustomerDto'> {
		firstName: string & Types.MaxLength<50> | null;
		lastName: string & Types.MaxLength<50> | null;
		phone: string | "" | null;
		email: string & Types.Email | null;
		note: string | null;
		customerType: CustomerTypeEnum & Types.Default<CustomerTypeEnum.new>;

		active: Enum.ActiveEnum;
	}

	export interface Entity extends IBaseItem<'CustomerDto'>, DTO {

		getNamesake(): Cursor<ICustomer.Entity, ICustomer.Entity>;

	}

}
