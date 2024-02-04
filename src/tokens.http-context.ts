import {HttpContextToken} from "@angular/common/http";
import {IEndpointReplace} from "@utility/domain/interface/i.endpoint/i.endpoint-replace";

export const TokensHttpContext = {
  PATH: new HttpContextToken<string>(() => 'path'),
  REPLACE: new HttpContextToken<IEndpointReplace>(() => ({})),
};
