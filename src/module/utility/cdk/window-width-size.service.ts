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

	// Tablet
	public tabletBreakpoints$ = this.breakpointObserver.observe(['(min-width: 640px) and (max-width: 1023px)']);
	public isTablet$ = this.tabletBreakpoints$.pipe(
		map((state: BreakpointState) => state.matches)
	);

	// Is not tablet
	public noTabletBreakpoints$ = this.breakpointObserver.observe(['(max-width: 639px)', '(min-width: 1024px)']);
	public isNotTablet$ = this.noTabletBreakpoints$.pipe(
		map((state: BreakpointState) => state.matches)
	);

	// Desktop
	public desktopBreakpoints$ = this.breakpointObserver.observe(['(min-width: 1024px)']);
	public isDesktop$ = this.desktopBreakpoints$.pipe(
		map((state: BreakpointState) => state.matches)
	);

	// Is not desktop
	public noDesktopBreakpoints$ = this.breakpointObserver.observe(['(max-width: 1023px)']);
	public isNotDesktop$ = this.noDesktopBreakpoints$.pipe(
		map((state: BreakpointState) => state.matches)
	);

	// Laptop
	public laptopBreakpoints$ = this.breakpointObserver.observe(['(min-width: 1024px) and (max-width: 1279px)']);
	public isLaptop$ = this.laptopBreakpoints$.pipe(
		map((state: BreakpointState) => state.matches)
	);

	// Is not laptop
	public noLaptopBreakpoints$ = this.breakpointObserver.observe(['(max-width: 1023px)', '(min-width: 1280px)']);
	public isNotLaptop$ = this.noLaptopBreakpoints$.pipe(
		map((state: BreakpointState) => state.matches)
	);

	// Laptop L
	public laptopLBreakpoints$ = this.breakpointObserver.observe(['(min-width: 1280px) and (max-width: 1535px)']);
	public isLaptopL$ = this.laptopLBreakpoints$.pipe(
		map((state: BreakpointState) => state.matches)
	);

	// Is not laptop L
	public noLaptopLBreakpoints$ = this.breakpointObserver.observe(['(max-width: 1279px)', '(min-width: 1536px)']);
	public isNotLaptopL$ = this.noLaptopLBreakpoints$.pipe(
		map((state: BreakpointState) => state.matches)
	);

	// Laptop XL
	public laptopXlBreakpoints$ = this.breakpointObserver.observe(['(min-width: 1536px)']);
	public isLaptopXl$ = this.laptopXlBreakpoints$.pipe(
		map((state: BreakpointState) => state.matches)
	);

	// Is not laptop XL
	public noLaptopXlBreakpoints$ = this.breakpointObserver.observe(['(max-width: 1535px)']);
	public isNotLaptopXl$ = this.noLaptopXlBreakpoints$.pipe(
		map((state: BreakpointState) => state.matches)
	);

	// Desktop L
	public desktopLBreakpoints$ = this.breakpointObserver.observe(['(min-width: 1536px) and (max-width: 1919px)']);
	public isDesktopL$ = this.desktopLBreakpoints$.pipe(
		map((state: BreakpointState) => state.matches)
	);

	// Is not desktop L
	public noDesktopLBreakpoints$ = this.breakpointObserver.observe(['(max-width: 1535px)', '(min-width: 1920px)']);
	public isNotDesktopL$ = this.noDesktopLBreakpoints$.pipe(
		map((state: BreakpointState) => state.matches)
	);

	// Desktop XL
	public desktopXlBreakpoints$ = this.breakpointObserver.observe(['(min-width: 1920px)']);
	public isDesktopXl$ = this.desktopXlBreakpoints$.pipe(
		map((state: BreakpointState) => state.matches)
	);

	// Is not desktop XL
	public noDesktopXlBreakpoints$ = this.breakpointObserver.observe(['(max-width: 1919px)']);
	public isNotDesktopXl$ = this.noDesktopXlBreakpoints$.pipe(
		map((state: BreakpointState) => state.matches)
	);

	// 4K
	public fourKBreakpoints$ = this.breakpointObserver.observe(['(min-width: 2560px)']);
	public isFourK$ = this.fourKBreakpoints$.pipe(
		map((state: BreakpointState) => state.matches)
	);

	// Is not 4K
	public noFourKBreakpoints$ = this.breakpointObserver.observe(['(max-width: 2559px)']);
	public isNoFourK$ = this.noFourKBreakpoints$.pipe(
		map((state: BreakpointState) => state.matches)
	);

	// 8K
	public eightKBreakpoints$ = this.breakpointObserver.observe(['(min-width: 3840px)']);
	public isEightK$ = this.eightKBreakpoints$.pipe(
		map((state: BreakpointState) => state.matches)
	);

	// Is not 8K
	public noEightKBreakpoints$ = this.breakpointObserver.observe(['(max-width: 3839px)']);
	public isNoEightK$ = this.noEightKBreakpoints$.pipe(
		map((state: BreakpointState) => state.matches)
	);

	// 16K
	public sixteenKBreakpoints$ = this.breakpointObserver.observe(['(min-width: 7680px)']);
	public isSixteenK$ = this.sixteenKBreakpoints$.pipe(
		map((state: BreakpointState) => state.matches)
	);

	// Is not 16K
	public noSixteenKBreakpoints$ = this.breakpointObserver.observe(['(max-width: 7679px)']);
	public isNoSixteenK$ = this.noSixteenKBreakpoints$.pipe(
		map((state: BreakpointState) => state.matches)
	);


}
