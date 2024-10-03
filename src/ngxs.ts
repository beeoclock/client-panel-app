import {NgxsModule} from "@ngxs/store";
import {IdentityState} from "@identity/state/identity/identity.state";
import {AppState} from "@utility/state/app/app.state";
import {ClientState} from "@client/state/client/client.state";
import {MemberState} from "@member/state/member/member.state";
import {environment} from "@environment/environment";
import {NgxsReduxDevtoolsPluginModule} from "@ngxs/devtools-plugin";
import {PaymentState} from "@module/payment/state/payment/payment.state";
import {NgxsSelectSnapshotModule} from "@ngxs-labs/select-snapshot";
import {NgxsDispatchPluginModule} from "@ngxs-labs/dispatch-decorator";
import {SocketState} from "@utility/state/socket/socket.state";

export const ngxsProviders = [
	NgxsModule.forRoot([IdentityState, AppState, ClientState, MemberState, PaymentState, SocketState], {
		developmentMode: !environment.production
	}),
	NgxsReduxDevtoolsPluginModule.forRoot({
		disabled: environment.production
	}),
	NgxsSelectSnapshotModule.forRoot(),
	NgxsDispatchPluginModule.forRoot(),
];
