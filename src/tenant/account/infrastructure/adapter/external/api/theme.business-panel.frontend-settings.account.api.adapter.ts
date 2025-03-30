import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {accountEndpointEnum} from "@tenant/account/infrastructure/endpoint/account.endpoint";
import {ThemeEnum} from "@utility/cdk/theme.service";

@Injectable({
	providedIn: 'root'
})
export class ThemeBusinessPanelFrontendSettingsAccountApiAdapter extends BaseApiAdapter<object, [ThemeEnum]> {

	public override execute$(theme: ThemeEnum) {
		return this.httpClient.put(accountEndpointEnum.accountFrontendSettingsBusinessPanelTheme, {
			theme
		});
	}

}
