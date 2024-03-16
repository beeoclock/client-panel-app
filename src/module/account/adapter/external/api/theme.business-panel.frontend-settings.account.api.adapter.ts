import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {accountEndpointEnum} from "@module/account/endpoint/account.endpoint";
import {ThemeEnum} from "@utility/cdk/theme.service";

@Injectable({
	providedIn: 'root'
})
export class ThemeBusinessPanelFrontendSettingsAccountApiAdapter extends BaseApiAdapter<object, [ThemeEnum]> {

	public override execute$(theme: ThemeEnum) {
		return this.httpClient.patch(accountEndpointEnum.accountFrontendSettingsBusinessPanelTheme, {
			theme
		});
	}

}
