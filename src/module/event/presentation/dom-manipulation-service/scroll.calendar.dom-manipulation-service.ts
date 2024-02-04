import {inject, Injectable} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {NGXLogger} from "ngx-logger";
import {firstValueFrom} from "rxjs";
import {BooleanState} from "@utility/domain";
import {WindowWidthSizeService} from "@utility/cdk/window-width-size.service";
import {ContainerCalendarComponent} from "@event/presentation/component/calendar/container.calendar.component";

@Injectable({
	providedIn: 'root'
})
export class ScrollCalendarDomManipulationService {

	private readonly ngxLogger = inject(NGXLogger);
	private readonly document = inject(DOCUMENT);
	private readonly windowWidthSizeService = inject(WindowWidthSizeService);

	public readonly isScrolling = new BooleanState(false);

	private containerOfCalendarsRef: ContainerCalendarComponent | undefined;

	public setContainerOfCalendarsRef(containerOfCalendarsRef: ContainerCalendarComponent) {
		this.containerOfCalendarsRef = containerOfCalendarsRef;
		return this;
	}

	public async initDesktopMouseHandle() {

		if (!this.containerOfCalendarsRef) {
			this.ngxLogger.error('Container of calendars ref is not defined');
			return;
		}

		const isNotDesktop = await firstValueFrom(this.windowWidthSizeService.isNotDesktop$);

		if (isNotDesktop) {
			this.ngxLogger.error('This method should be called only on desktop');
			return;
		}

		const mouseDown = new BooleanState(false);

		const container: HTMLDivElement = this.containerOfCalendarsRef.elementRef.nativeElement;
		container.addEventListener('mousedown', () => {
			this.isScrolling.switchOff();
			if (mouseDown.isOff) {
				mouseDown.switchOn();
			}
		});
		container.addEventListener('mousemove', (event) => {
			this.isScrolling.switchOn();
			if (mouseDown.isOn) {
				// Write code which will be change scroll position of container on mouse move
				container.scrollLeft -= event.movementX;
				container.scrollTop -= event.movementY;
			}
		});
		container.addEventListener('mouseup', (event) => {
			if (mouseDown.isOn) {
				mouseDown.switchOff();
			}
			console.log(this.isScrolling.isOn)
			if (this.isScrolling.isOn) {
				event.preventDefault();
				event.stopPropagation();
			}
		});

		return this;

	}

}