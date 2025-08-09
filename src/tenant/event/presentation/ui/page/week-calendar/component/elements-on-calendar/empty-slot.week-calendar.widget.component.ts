import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	effect,
	ElementRef,
	HostBinding,
	HostListener,
	inject,
	input,
	Renderer2
} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {NGXLogger} from "ngx-logger";
import {
	CalendarWithSpecialistsQueries
} from "@tenant/event/infrastructure/state/calendar-with-specialists/calendar–with-specialists.queries";
import {Store} from "@ngxs/store";
import {BooleanState} from "@shared/domain";
import {IMember} from "@tenant/member/member/domain/interface/i.member";
import {Router} from "@angular/router";
import {SecondRouterOutletService} from "@src/second.router-outlet.service";
import AdditionalMenuComponent from "@tenant/event/presentation/ui/component/additional-menu/additional-menu.component";
import {toSignal} from "@angular/core/rxjs-interop";
import {v4} from 'uuid';

@Component({
	selector: 'app-empty-slot-week-calendar-widget-component',
	template: `
		+ {{ 'keyword.capitalize.add-event' | translate }}
	`,
	imports: [
		TranslateModule
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	host: {
		class: 'active:bg-blue-400 relative active:text-white bg-neutral-100 border-2 border-[#00000038] cursor-pointer inline-flex min-h-20 h-full max-h-44 hover:opacity-100 items-center justify-center opacity-0 px-2 rounded-md text-neutral-500 transition-all'
	}
})
export class EmptySlotWeekCalendarWidgetComponent implements AfterViewInit {

	public readonly startISO = input.required<string>();
	public readonly durationInMinutes = input.required<number>();
	public readonly member = input.required<IMember.EntityRaw>();
	public readonly anchorId = input(v4())

	public readonly showSquare = new BooleanState(false);

	@HostBinding('style.touch-action')
	public touchAction = 'auto';

	private readonly ngxLogger = inject(NGXLogger);
	private readonly store = inject(Store);
	private readonly router = inject(Router);
	private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
	private readonly renderer2 = inject(Renderer2);
	private readonly secondRouterOutletService = inject(SecondRouterOutletService);

	public readonly selectedDate$ = this.store.select(CalendarWithSpecialistsQueries.start);
	public readonly selectedDate = toSignal(this.selectedDate$);

	public constructor() {
		effect(() => {
			const activated = this.secondRouterOutletService.activated();
			if (this.showSquare.isOn) {
				this.showSelectedSquare(false);
			}
			if (activated instanceof AdditionalMenuComponent) {
				if (activated.anchorId() === this.anchorId()) {
					this.showSelectedSquare(true);
				}
			}
			const deactivated = this.secondRouterOutletService.deactivated();
			if (deactivated instanceof AdditionalMenuComponent) {
				if (deactivated.anchorId() === this.anchorId()) {
					this.showSelectedSquare(false);
				}
			}
		});
	}

	@HostListener('click')
	public async onClick() {
		this.ngxLogger.debug('EmptySlotCalendarWithSpecialistWidgetComponent:onClick');
		await this.openAdditionalMenu();
	}

	@HostListener('tap')
	public async onTap() {
		this.ngxLogger.debug('EmptySlotCalendarWithSpecialistWidgetComponent:onTap');
		await this.openAdditionalMenu();
	}

	public ngAfterViewInit() {
		this.renderer2.setStyle(this.elementRef.nativeElement, 'z-index', '2');
	}

	public async openAdditionalMenu() {
		await this.router.navigate([{outlets: {second: ['additional-menu', this.member()._id, this.startISO()]}}], {
			queryParams: {
				anchorId: this.anchorId()
			}
		})
	}

	public showSelectedSquare(show: boolean) {
		this.ngxLogger.debug('showSelectedSquare', show);
		this.showSquare.toggle(show);

		const method = show ? this.renderer2.addClass : this.renderer2.removeClass;

		method(this.elementRef.nativeElement, '!opacity-100');
		method(this.elementRef.nativeElement, 'border-dashed');
		method(this.elementRef.nativeElement, 'border-beeColor-500');

	}

}
