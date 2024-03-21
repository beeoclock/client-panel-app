import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";
import {TranslateService} from "@ngx-translate/core";

export interface IEndpointReplace {
	[key: string]: string | number | boolean;
}

export interface EndpointInterface {
	source: SourceNetworkEnum; // Server
	loader?: boolean; // Default false, change it in environment
	replace?: boolean; // Default false, change it in environment
	defaultErrorHandler?: boolean; // Default true, change it in environment
	before?: {
		accept?: boolean;
	};
	after?: {
		success?: {
			notification?: {
				execute?: (translateService: TranslateService) => {
					title: string;
					message: string;
				};
			};
		}
	}
	header?: {
		authorization?: boolean;
	};
}
