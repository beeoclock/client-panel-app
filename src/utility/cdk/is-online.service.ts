import {inject, Injectable} from "@angular/core";
import {BehaviorSubject, fromEvent, map} from "rxjs";
import {DOCUMENT} from "@angular/common";

@Injectable()
export class IsOnlineService {

	private readonly document = inject(DOCUMENT);

	readonly #isOnline$ = new BehaviorSubject<boolean>(this.document.defaultView?.navigator.onLine ?? false);

	public readonly isOnline$ = this.#isOnline$.asObservable();

	public readonly isOffline$ = this.isOnline$.pipe(map((isOnline) => !isOnline));

	private handleOnlineChange(online: boolean) {
		if (online !== this.#isOnline$.getValue()) {
			this.#isOnline$.next(online);
		}
	}

	public isOnline() {
		return this.#isOnline$.getValue();
	}

	public isOffline() {
		return !this.isOnline();
	}

	public constructor() {

		if (this.document.defaultView) {

			fromEvent(this.document.defaultView, 'offline').subscribe(() => this.handleOnlineChange(false));
			fromEvent(this.document.defaultView, 'online').subscribe(() => this.handleOnlineChange(true));

		}

	}

}
