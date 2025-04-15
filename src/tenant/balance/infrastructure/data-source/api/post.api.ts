import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@core/shared/checker";
import {IBalance} from "@tenant/balance/domain";
import {balanceEndpointEnum} from "@tenant/balance/infrastructure/endpoint/balance.endpoint";

@Injectable()
export class PostApi extends BaseApiAdapter<IBalance.DTO, [IBalance.DTO]> {

	/**
	 * SAVE NEW ITEM OR UPDATE ITEM BY ID
	 * @param value
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(value: IBalance.DTO) {
		return this.httpClient.post<IBalance.EntityRaw>(balanceEndpointEnum.create, value);
	}

}
