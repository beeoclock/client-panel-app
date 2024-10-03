// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SocketActions {
	export class ConnectSocket {
		static readonly type = '[Socket] Connect';
		constructor(public payload: { url: string, options?: any }) {}
	}
	export class DisconnectSocket {
		static readonly type = '[Socket] Disconnect';
	}

	export class SendSocketMessage {
		static readonly type = '[Socket] Send Message';
		constructor(public payload: any) {}
	}

	export class SocketMessageReceived {
		static readonly type = '[Socket] Message Received';
		constructor(public payload: any) {}
	}
}
