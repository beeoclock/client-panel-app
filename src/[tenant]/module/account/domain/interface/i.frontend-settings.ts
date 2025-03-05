import {LanguageCodeEnum} from "@core/shared/enum";
import {ThemeEnum} from "@utility/cdk/theme.service";

export interface IFrontendSettings {
	object: 'FrontendSettings';
	businessPanel: {
		language: LanguageCodeEnum;
		theme: ThemeEnum;
	};
}

export interface PIFrontendSettings {
	object: 'FrontendSettings';
	businessPanel: {
		language?: LanguageCodeEnum;
		theme?: ThemeEnum;
	};
}
