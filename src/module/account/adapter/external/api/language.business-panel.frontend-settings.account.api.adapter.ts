import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {accountEndpointEnum} from "@module/account/endpoint/account.endpoint";
import {LanguageCodeEnum} from "@utility/domain/enum";

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
