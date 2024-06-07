import {inject, Injectable} from '@angular/core';
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import {map, Observable} from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class WindowWidthSizeService {
	private readonly breakpointObserver = inject(BreakpointObserver);

	private createBreakpointObservable(breakpoints: string[]): Observable<boolean> {
		return this.breakpointObserver.observe(breakpoints).pipe(map((state: BreakpointState) => state.matches));
	}

	// Mobile
	public isMobile$ = this.createBreakpointObservable(['(max-width: 639px)']);
	public isNotMobile$ = this.createBreakpointObservable(['(min-width: 640px)']);
	// Table
	public isTablet$ = this.createBreakpointObservable(['(min-width: 640px) and (max-width: 1023px)']);
	public isNotTablet$ = this.createBreakpointObservable(['(max-width: 639px)', '(min-width: 1024px)']);

	// Desktop
	public isDesktop$ = this.createBreakpointObservable(['(min-width: 1024px)']);
	public isNotDesktop$ = this.createBreakpointObservable(['(max-width: 1023px)']);

	// Laptop
	public isLaptop$ = this.createBreakpointObservable(['(min-width: 1024px) and (max-width: 1279px)']);
	public isNotLaptop$ = this.createBreakpointObservable(['(max-width: 1023px)', '(min-width: 1280px)']);

	// Laptop L
	public isLaptopL$ = this.createBreakpointObservable(['(min-width: 1280px) and (max-width: 1535px)']);
	public isNotLaptopL$ = this.createBreakpointObservable(['(max-width: 1279px)', '(min-width: 1536px)']);

	// Laptop XL
	public isLaptopXl$ = this.createBreakpointObservable(['(min-width: 1536px)']);
	public isNotLaptopXl$ = this.createBreakpointObservable(['(max-width: 1535px)']);

	// Desktop XL
	public isDesktopL$ = this.createBreakpointObservable(['(min-width: 1536px) and (max-width: 1919px)']);
	public isNotDesktopL$ = this.createBreakpointObservable(['(max-width: 1535px)', '(min-width: 1920px)']);

	// Desktop XL
	public isDesktopXl$ = this.createBreakpointObservable(['(min-width: 1920px)']);
	public isNotDesktopXl$ = this.createBreakpointObservable(['(max-width: 1919px)']);

	// 4K
	public isFourK$ = this.createBreakpointObservable(['(min-width: 2560px)']);
	public isNoFourK$ = this.createBreakpointObservable(['(max-width: 2559px)']);

	// 8K
	public isEightK$ = this.createBreakpointObservable(['(min-width: 3840px)']);
	public isNoEightK$ = this.createBreakpointObservable(['(max-width: 3839px)']);

	// 16K
	public isSixteenK$ = this.createBreakpointObservable(['(min-width: 7680px)']);
	public isNoSixteenK$ = this.createBreakpointObservable(['(max-width: 7679px)']);
}
