import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {IFrontendSettings} from "@account/domain/interface/i.frontend-settings";
import {accountEndpointEnum} from "@account/infrastructure/endpoint/account.endpoint";

@Injectable({
	providedIn: 'root'
})
export class GetFrontendSettingsAccountApiAdapter extends BaseApiAdapter<IFrontendSettings> {

	public override execute$() {
		return this.httpClient.get<IFrontendSettings>(accountEndpointEnum.getFrontendSettings);
	}

}
