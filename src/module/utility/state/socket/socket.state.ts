import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { tap } from 'rxjs/operators';
import {SocketActions} from "@utility/state/socket/socket.actions";

export interface SocketStateModel {
	connected: boolean;
	messages: any[];
}

@State<SocketStateModel>({
	name: 'socket',
	defaults: {
		connected: false,
		messages: []
	}
})
@Injectable()
export class SocketState {
	private socket: Socket | undefined;

	@Selector()
	static isConnected(state: SocketStateModel): boolean {
		return state.connected;
	}

	@Selector()
	static getMessages(state: SocketStateModel): any[] {
		return state.messages;
	}

	@Action(SocketActions.ConnectSocket)
	connectSocket(ctx: StateContext<SocketStateModel>, { payload }: SocketActions.ConnectSocket) {
		const { url, options } = payload;

		if (this.socket) {
			this.socket.disconnect();
		}

		const config: SocketIoConfig = { url, options };
		this.socket = new Socket(config);

		this.socket.connect();

		this.socket.fromEvent('connect').pipe(
			tap(() => {
				ctx.patchState({ connected: true });
			})
		).subscribe();

		this.socket.fromEvent('disconnect').pipe(
			tap(() => {
				ctx.patchState({ connected: false });
			})
		).subscribe();

		this.socket.fromEvent('order-created').pipe(
			tap((message: any) => {
				ctx.dispatch(new SocketActions.SocketMessageReceived(message));
			})
		).subscribe();
	}

	@Action(SocketActions.DisconnectSocket)
	disconnectSocket(ctx: StateContext<SocketStateModel>) {
		if (this.socket) {
			this.socket.disconnect();
			ctx.patchState({ connected: false });
		}
	}

	@Action(SocketActions.SendSocketMessage)
	sendMessage(ctx: StateContext<SocketStateModel>, { payload }: SocketActions.SendSocketMessage) {
		if (this.socket) {
			this.socket.emit('message', payload);
		}
	}

	@Action(SocketActions.SocketMessageReceived)
	onMessageReceived(ctx: StateContext<SocketStateModel>, { payload }: SocketActions.SocketMessageReceived) {
		const state = ctx.getState();
		ctx.patchState({
			messages: [...state.messages, payload]
		});
	}
}
