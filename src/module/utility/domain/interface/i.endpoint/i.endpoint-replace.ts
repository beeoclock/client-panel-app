import {RequestMethodEnum} from "@utility/domain/enum/request-method.enum";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";

export interface IEndpointReplace {
  [key: string]: string | number | boolean;
}

export interface EndpointInterface {
  path: string;
  method: RequestMethodEnum;
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
				execute?: (translateService: any) => {
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
