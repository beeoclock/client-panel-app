import {NgxsModule} from "@ngxs/store";
import {IdentityState} from "@identity/state/identity/identity.state";
import {AppState} from "@utility/state/app/app.state";
import {ClientState} from "@client/state/client/client.state";
import {MemberState} from "@member/state/member/member.state";
import {environment} from "@environment/environment";
import {NgxsReduxDevtoolsPluginModule} from "@ngxs/devtools-plugin";

export const ngxsProviders = [
	NgxsModule.forRoot([IdentityState, AppState, ClientState, MemberState], {
		developmentMode: !environment.production
	}),
	NgxsReduxDevtoolsPluginModule.forRoot({
		disabled: environment.production
	}),
];
