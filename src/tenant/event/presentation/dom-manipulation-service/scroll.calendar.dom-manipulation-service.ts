import {inject, Injectable} from "@angular/core";
import {NGXLogger} from "ngx-logger";
import {firstValueFrom} from "rxjs";
import {BooleanState} from "@utility/domain";
import {WindowWidthSizeService} from "@utility/cdk/window-width-size.service";

@Injectable()
export class ScrollCalendarDomManipulationService {

	private readonly ngxLogger = inject(NGXLogger);
	private readonly windowWidthSizeService = inject(WindowWidthSizeService);

	public readonly isScrolling = new BooleanState(false);

	private nativeElement: HTMLDivElement | undefined;

	public setNativeElement(nativeElement: HTMLDivElement) {
		this.nativeElement = nativeElement;
		return this;
	}

	public async initDesktopMouseHandle() {

		if (!this.nativeElement) {
			this.ngxLogger.error('Container of calendars ref is not defined');
			return;
		}

		const isNotDesktop = await firstValueFrom(this.windowWidthSizeService.isNotDesktop$);

		if (isNotDesktop) {
			this.ngxLogger.error('This method should be called only on desktop');
			return;
		}

		const mouseDown = new BooleanState(false);

		this.nativeElement.addEventListener('mousedown', () => {
			this.isScrolling.switchOff();
			if (mouseDown.isOff) {
				mouseDown.switchOn();
			}
		});
		this.nativeElement.addEventListener('mousemove', (event) => {
			this.isScrolling.switchOn();
			if (mouseDown.isOn) {

				if (!this.nativeElement) {
					return;
				}

				// Write code which will be change scroll position of container on mouse move
				this.nativeElement.scrollLeft -= event.movementX;
				this.nativeElement.scrollTop -= event.movementY;
			}
		});
		this.nativeElement.addEventListener('mouseup', (event) => {
			if (mouseDown.isOn) {
				mouseDown.switchOff();
			}
			if (this.isScrolling.isOn) {
				event.preventDefault();
				event.stopPropagation();
			}
		});

		return this;

	}

}
