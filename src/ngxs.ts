import {NgxsModule} from "@ngxs/store";
import {IdentityState} from "@identity/infrastructure/state/identity/identity.state";
import {AppState} from "@utility/state/app/app.state";
import {environment} from "@environment/environment";
import {NgxsReduxDevtoolsPluginModule} from "@ngxs/devtools-plugin";
import {NgxsSelectSnapshotModule} from "@ngxs-labs/select-snapshot";
import {NgxsDispatchPluginModule} from "@ngxs-labs/dispatch-decorator";
import {SocketState} from "@utility/state/socket/socket.state";
import {NgxsRouterPluginModule} from "@ngxs/router-plugin";

export const ngxsProviders = [
	NgxsModule.forRoot([IdentityState, AppState, SocketState], {
		developmentMode: !environment.production
	}),
	NgxsReduxDevtoolsPluginModule.forRoot({
		disabled: environment.production,
		trace: true
	}),
	NgxsSelectSnapshotModule.forRoot(),
	NgxsDispatchPluginModule.forRoot(),
	NgxsRouterPluginModule.forRoot()
];
