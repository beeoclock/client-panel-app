import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@core/shared/checker";
import {balanceEndpointEnum} from "@tenant/balance/infrastructure/endpoint/balance.endpoint";
import {TopUpBalanceResponse} from "@tenant/balance/application/dto/top-up-balance.response";
import {TopUpBalanceDto} from "@tenant/balance/application/dto/top-up-balance.dto";
import {TopUpBalancePort} from "@tenant/balance/infrastructure/port/out/top-up.port";

@Injectable()
export class PostApi extends BaseApiAdapter<TopUpBalanceResponse, [TopUpBalanceDto]> implements TopUpBalancePort {

	/**
	 * SAVE NEW ITEM OR UPDATE ITEM BY ID
	 * @param value
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(value: TopUpBalanceDto) {
		return this.httpClient.post<TopUpBalanceResponse>(balanceEndpointEnum.create, value);
	}

}
