import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import * as Client from "@client/domain";
import {clientEndpointEnum} from "@client/endpoint/client.endpoint";

@Injectable({
	providedIn: 'root'
})
export class ItemClientApiAdapter extends BaseApiAdapter<Client.IClient> {

	public override execute$() {
		return this.httpClient.get<Client.IClient>(clientEndpointEnum.item);
	}

}
