import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@utility/checker";
import {ICustomer} from "@customer/domain";
import {customerEndpointEnum} from "@module/customer";

@Injectable()
export class CreateCustomerApi extends BaseApiAdapter<ICustomer.DTO, [ICustomer.DTO]> {

	/**
	 * SAVE NEW ITEM OR UPDATE ITEM BY ID
	 * @param value
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(value: ICustomer.DTO) {
		return this.httpClient.post<ICustomer.DTO>(customerEndpointEnum.create, value);
	}

}
