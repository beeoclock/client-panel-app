import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	HostBinding,
	HostListener,
	inject,
	Input
} from "@angular/core";
import {RIMember} from "@member/domain";
import {firstValueFrom} from "rxjs";
import {CalendarWithSpecialistsAction} from "@event/state/calendar-with-specialists/calendar-with-specialists.action";
import {AdditionalMenuComponent} from "@event/presentation/component/additional-menu/additional-menu.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NGXLogger} from "ngx-logger";
import {CalendarWithSpecialistsQueries} from "@event/state/calendar-with-specialists/calendar–with-specialists.queries";
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

	@Input({required: true})
	public hour!: number;

	@Input({required: true})
	public member!: RIMember;

	private readonly translateService = inject(TranslateService);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly store = inject(Store);
	private readonly whacAMaleProvider = inject(WhacAMoleProvider);
	private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

	public readonly selectedDate$ = this.store.select(CalendarWithSpecialistsQueries.start);

	public readonly showSquare = new BooleanState(false);

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

	@HostBinding('style.touch-action')
	public touchAction = 'auto';

	@HostBinding()
	public get class() {
		return 'active:bg-blue-400 relative active:text-white bg-neutral-100 border-2 border-[#00000038] cursor-pointer flex h-full hover:opacity-100 items-center justify-center opacity-0 px-2 rounded-md text-neutral-500 transition-all';
	}

	public ngAfterViewInit() {
		this.elementRef.nativeElement.style.zIndex = '2';
	}

	public async openAdditionalMenu() {

		this.showSelectedSquare(true);

		const title = this.translateService.instant('event.additionalMenu.title');

		const selectedDate = await firstValueFrom(this.selectedDate$);

		this.ngxLogger.debug('openAdditionalMenu:selectedDate', selectedDate);

		const callback = () => {
			this.ngxLogger.debug('Callback');
			this.store.dispatch(new CalendarWithSpecialistsAction.GetItems());
		};

		const datetimeISO = selectedDate
			.startOf('day')
			.plus({
				hours: this.hour,
			})
			.toJSDate()
			.toISOString();

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

								if (datetimeISOComponent !== datetimeISO || memberComponent?._id !== this.member._id) {
									this.showSelectedSquare(false);
								}
							}
						}
					}
				}
			},
			componentInputs: {
				datetimeISO,
				member: this.member,
				callback
			}
		});

	}

	public showSelectedSquare(show: boolean) {
		this.ngxLogger.debug('showSelectedSquare', show);
		this.showSquare.toggle(show);

		if (show) {
			this.elementRef.nativeElement.classList.add('!opacity-100');
			this.elementRef.nativeElement.classList.add('border-dashed');
			this.elementRef.nativeElement.classList.add('border-beeColor-500');
		} else {
			this.elementRef.nativeElement.classList.remove('!opacity-100');
			this.elementRef.nativeElement.classList.remove('border-dashed');
			this.elementRef.nativeElement.classList.remove('border-beeColor-500');
		}

	}

}
