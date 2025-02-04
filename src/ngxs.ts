import {NgxsModule} from "@ngxs/store";
import {IdentityState} from "@identity/state/identity/identity.state";
import {AppState} from "@utility/state/app/app.state";
import {ClientState} from "@client/state/client/client.state";
import {environment} from "@environment/environment";
import {NgxsReduxDevtoolsPluginModule} from "@ngxs/devtools-plugin";
import {PaymentState} from "@module/payment/state/payment/payment.state";
import {NgxsSelectSnapshotModule} from "@ngxs-labs/select-snapshot";
import {NgxsDispatchPluginModule} from "@ngxs-labs/dispatch-decorator";
import {SocketState} from "@utility/state/socket/socket.state";
import {NgxsRouterPluginModule} from "@ngxs/router-plugin";

export const ngxsProviders = [
	NgxsModule.forRoot([IdentityState, AppState, ClientState, PaymentState, SocketState], {
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
