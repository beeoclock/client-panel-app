import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {accountEndpointEnum} from "@tenant/account/infrastructure/endpoint/account.endpoint";
import {LanguageCodeEnum} from "@core/shared/enum";

@Injectable({
	providedIn: 'root'
})
export class LanguageBusinessPanelFrontendSettingsAccountApiAdapter extends BaseApiAdapter<object, [LanguageCodeEnum]> {

	public override execute$(language: LanguageCodeEnum) {
		return this.httpClient.put(accountEndpointEnum.accountFrontendSettingsBusinessPanelLanguage, {
			language
		});
	}

}
