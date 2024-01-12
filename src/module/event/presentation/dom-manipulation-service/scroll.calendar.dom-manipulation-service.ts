import {inject, Injectable, ViewContainerRef} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {NGXLogger} from "ngx-logger";
import {firstValueFrom} from "rxjs";
import {BooleanState} from "@utility/domain";
import {WindowWidthSizeService} from "@utility/cdk/window-width-size.service";

@Injectable({
	providedIn: 'root'
})
export class ScrollCalendarDomManipulationService {

	private readonly ngxLogger = inject(NGXLogger);
	private readonly document = inject(DOCUMENT);
	private readonly windowWidthSizeService = inject(WindowWidthSizeService);

	private containerOfCalendarsRef: ViewContainerRef | undefined;

	public setContainerOfCalendarsRef(containerOfCalendarsRef: ViewContainerRef) {
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

		const container: HTMLDivElement = this.containerOfCalendarsRef.element.nativeElement;
		container.addEventListener('mousedown', () => {
			if (mouseDown.isOff) {
				mouseDown.switchOn();
			}
		});
		container.addEventListener('mousemove', (event) => {
			if (mouseDown.isOn) {
				// Write code which will be change scroll position of container on mouse move
				container.scrollLeft -= event.movementX;
				container.scrollTop -= event.movementY;
			}
		});
		container.addEventListener('mouseup', () => {
			if (mouseDown.isOn) {
				mouseDown.switchOff();
			}
		});

		return this;

	}

}
