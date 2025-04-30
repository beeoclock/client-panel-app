import {NgxsModule} from "@ngxs/store";
import {IdentityState} from "@identity/identity/presentation/state/identity/identity.state";
import {environment} from "@environment/environment";
import {NgxsReduxDevtoolsPluginModule} from "@ngxs/devtools-plugin";
import {NgxsSelectSnapshotModule} from "@ngxs-labs/select-snapshot";
import {NgxsDispatchPluginModule} from "@ngxs-labs/dispatch-decorator";
import {NgxsRouterPluginModule} from "@ngxs/router-plugin";
import {AppState} from "@shared/state/app/app.state";

export const ngxsProviders = [
	NgxsModule.forRoot([IdentityState, AppState], {
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
