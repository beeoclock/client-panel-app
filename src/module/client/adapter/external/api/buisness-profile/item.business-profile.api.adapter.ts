import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import * as Client from "@client/domain";
import {businessProfileEndpointEnum} from "@client/endpoint/business-profile.endpoint";

@Injectable({
	providedIn: 'root'
})
export class ItemBusinessProfileApiAdapter extends BaseApiAdapter<Client.IClient> {

	public override execute$() {
		return this.httpClient.get<Client.IClient>(businessProfileEndpointEnum.item);
	}

}
