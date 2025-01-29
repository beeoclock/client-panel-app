import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, fromEvent} from 'rxjs';
import {DOCUMENT} from "@angular/common";

@Injectable()
export class VisibilityService {

	private readonly document = inject(DOCUMENT);

	readonly #visibilityChange$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
	public readonly visibilityChange$ = this.#visibilityChange$.asObservable();

	public get isVisible(): boolean {
		return this.#visibilityChange$.value;
	}

	public constructor() {
		fromEvent(this.document, 'visibilitychange').subscribe(() => {
			this.#visibilityChange$.next(!this.document.hidden);
		});
	}
}
