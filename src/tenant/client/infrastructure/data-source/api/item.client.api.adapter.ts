import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import * as Client from "@core/business-logic/business-profile";
import {clientEndpointEnum} from "@tenant/client/infrastructure/endpoint/client.endpoint";

@Injectable({
	providedIn: 'root'
})
export class ItemClientApiAdapter extends BaseApiAdapter<Client.RIClient> {

	public override execute$() {
		return this.httpClient.get<Client.RIClient>(clientEndpointEnum.item);
	}

}
