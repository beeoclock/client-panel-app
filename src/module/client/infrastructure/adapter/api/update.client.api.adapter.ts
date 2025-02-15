import {Injectable} from '@angular/core';
import * as Client from '@client/domain';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@src/core/shared/checker";
import {clientEndpointEnum} from "@client/infrastructure/endpoint/client.endpoint";

@Injectable({
	providedIn: 'root'
})
export class UpdateClientApiAdapter extends BaseApiAdapter<Client.RIClient, [Client.IClient]> {

	/**
	 * SAVE NEW ITEM OR UPDATE ITEM BY ID
	 * @param value
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(value: Client.IClient) {
		return this.httpClient.put<Client.RIClient>(clientEndpointEnum.update, value);
	}

}
