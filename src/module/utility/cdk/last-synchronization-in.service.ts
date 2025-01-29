import {inject, Injectable} from "@angular/core";
import {TENANT_ID} from "@src/token";

@Injectable()
export class LastSynchronizationInService {

	public readonly tenantId$ = inject(TENANT_ID);

	public readonly key = 'lastSynchronizedIn';

	#lastSynchronizedIn: Map<string, string> = new Map<string, string>();

	public constructor() {
		const lastSynchronizedIn = localStorage.getItem(this.key);
		if (lastSynchronizedIn) {
			this.#lastSynchronizedIn = new Map<string, string>(JSON.parse(lastSynchronizedIn));
		}
	}

	public setLastSynchronizedIn(lastSynchronizedIn: string = new Date().toISOString()) {
		const tenantId = this.tenantId$.value;
		if (!tenantId) {
			return false;
		}
		this.#lastSynchronizedIn.set(tenantId, lastSynchronizedIn);
		const entries = this.#lastSynchronizedIn.entries();
		const entriesArray = Array.from(entries);
		const json = JSON.stringify(entriesArray);
		localStorage.setItem(this.key, json);
		return true;
	}

	public getLastSynchronizedIn(): string | null {
		const tenantId = this.tenantId$.value;
		if (!tenantId) {
			return null;
		}
		const lastSynchronizedIn = this.#lastSynchronizedIn.get(tenantId);
		return lastSynchronizedIn || null;
	}

}
