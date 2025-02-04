import {inject, Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {DOCUMENT} from "@angular/common";

@Injectable({
	providedIn: 'root'
})
export class VisibilityService implements OnDestroy {

	private readonly document = inject(DOCUMENT);

	#visibilitySubject = new BehaviorSubject<boolean>(!this.document.hidden);

	// Observable to notify about visibility changes
	public readonly visibility$ = this.#visibilitySubject.asObservable();

	public get isVisible(): boolean {
		return this.#visibilitySubject.value;
	}

	public constructor() {
		// Listen for the visibilitychange event
		this.document.addEventListener('visibilitychange', this.handleVisibilityChange);
	}

	private handleVisibilityChange = () => {
		const isVisible = this.document.visibilityState === 'visible';
		this.#visibilitySubject.next(isVisible);
	};

	public ngOnDestroy(): void {
		// Clean up the event listener when the service is destroyed
		this.document.removeEventListener('visibilitychange', this.handleVisibilityChange);
	}
}
