import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {IBalance} from "@tenant/balance/domain";
import {balanceEndpointEnum} from "@tenant/balance/infrastructure/endpoint/balance.endpoint";

@Injectable()
export class GetLastItemApi extends BaseApiAdapter<IBalance.DTO> {

	public override execute$() {
		return this.httpClient.get<IBalance.EntityRaw>(balanceEndpointEnum.lastItem);
	}

}
