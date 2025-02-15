import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {IFrontendSettings} from "@module/account/domain/interface/i.frontend-settings";
import {accountEndpointEnum} from "@module/account/infrastructure/endpoint/account.endpoint";

@Injectable({
	providedIn: 'root'
})
export class GetFrontendSettingsAccountApiAdapter extends BaseApiAdapter<IFrontendSettings> {

	public override execute$() {
		return this.httpClient.get<IFrontendSettings>(accountEndpointEnum.getFrontendSettings);
	}

}
