import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	HostBinding,
	HostListener,
	inject,
	input,
	Renderer2
} from "@angular/core";
import {RIMember} from "../../../../../../../core/business-logic/member";
import {firstValueFrom} from "rxjs";
import {AdditionalMenuComponent} from "@event/presentation/component/additional-menu/additional-menu.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NGXLogger} from "ngx-logger";
import {
	CalendarWithSpecialistsQueries
} from "@event/infrastructure/state/calendar-with-specialists/calendar–with-specialists.queries";
import {Store} from "@ngxs/store";
import {WhacAMoleProvider} from "@utility/presentation/whac-a-mole/whac-a-mole.provider";
import {BooleanState} from "@utility/domain";

@Component({
	selector: 'app-empty-slot-calendar-with-specialist-widget-component',
	template: `
		+ {{ 'keyword.capitalize.add-event' | translate }}
	`,
	imports: [
		TranslateModule
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true
})
export class EmptySlotCalendarWithSpecialistWidgetComponent implements AfterViewInit {

	public readonly startInMinutes = input.required<number>();

	public readonly durationInMinutes = input.required<number>();

	public readonly member = input.required<RIMember>();
	public readonly showSquare = new BooleanState(false);
	@HostBinding('style.touch-action')
	public touchAction = 'auto';
	private readonly translateService = inject(TranslateService);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly store = inject(Store);
	public readonly selectedDate$ = this.store.select(CalendarWithSpecialistsQueries.start);
	private readonly whacAMaleProvider = inject(WhacAMoleProvider);
	private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
	private readonly renderer2 = inject(Renderer2);

	@HostBinding()
	public get class() {
		return 'active:bg-blue-400 relative active:text-white bg-neutral-100 border-2 border-[#00000038] cursor-pointer flex h-full hover:opacity-100 items-center justify-center opacity-0 px-2 rounded-md text-neutral-500 transition-all';
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

		this.showSelectedSquare(true);

		const title = this.translateService.instant('event.additionalMenu.title');

		const selectedDate = await firstValueFrom(this.selectedDate$);

		this.ngxLogger.debug('openAdditionalMenu:selectedDate', selectedDate);

		const callback = () => {
			this.ngxLogger.debug('Callback');
		};

		const baseDateTime = selectedDate
			.startOf('day');

		let startDateTime = baseDateTime
			.plus({
				minutes: this.startInMinutes(),
			});

		if (startDateTime.offset !== baseDateTime.offset) {

			const offsetDifference = baseDateTime.offset - startDateTime.offset;
			startDateTime = startDateTime.plus({hours: offsetDifference / 60});

		}

		const datetimeISO = startDateTime.toJSDate().toISOString();

		await this.whacAMaleProvider.buildItAsync({
			component: AdditionalMenuComponent,
			title,
			callback: {
				on: {
					destroy: {
						after: () => {
							this.ngxLogger.debug('Callback:destroy:after');
							this.showSelectedSquare(false);
						}
					},
					update: {
						before: (componentInputs) => {
							this.ngxLogger.debug('Callback:update:before', componentInputs, this);
							if (componentInputs) {
								const {
									datetimeISO: datetimeISOComponent,
									member: memberComponent
								} = componentInputs as { datetimeISO: string; member: RIMember };

								this.ngxLogger.debug('Callback:update:before', {datetimeISOComponent, memberComponent});

								if (datetimeISOComponent !== datetimeISO || memberComponent?._id !== this.member()._id) {
									this.showSelectedSquare(false);
								}
							}
						}
					}
				}
			},
			componentInputs: {
				datetimeISO,
				member: this.member(),
				callback
			}
		});

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
