import {inject, Injectable} from "@angular/core";
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";
import {map} from "rxjs";

@Injectable({
	providedIn: "root"
})
export class WindowWidthSizeService {

	// public isMobile$ = window.matchMedia('(max-width: 639px)').matches;

	public readonly breakpointObserver = inject(BreakpointObserver);

	public mobileBreakpoints$ = this.breakpointObserver.observe(['(max-width: 639px)']);
	public isMobile$ = this.mobileBreakpoints$.pipe(
		map((state: BreakpointState) => state.matches)
	);

	public noMobileBreakpoints$ = this.breakpointObserver.observe(['(min-width: 640px)']);
	public isNotMobile$ = this.noMobileBreakpoints$.pipe(
		map((state: BreakpointState) => state.matches)
	);

}
