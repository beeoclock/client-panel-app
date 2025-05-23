import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	HostBinding,
	HostListener,
	inject,
	Input,
	Renderer2,
	viewChild,
	ViewEncapsulation
} from "@angular/core";
import {DatePipe} from "@angular/common";
import CalendarWithSpecialistLocaStateService
	from "@tenant/event/presentation/ui/page/calendar-with-specialists/v2/calendar-with-specialist.loca.state.service";
import {IEvent_V2} from "@tenant/event/domain";
import {IOrder} from "@tenant/order/order/domain/interface/i.order";
import {IOrderServiceDto} from "@tenant/order/order/domain/interface/i.order-service.dto";
import {IAbsence} from "@tenant/member/absence/domain/interface/i.absence";
import {DateTime} from "luxon";
import {NGXLogger} from "ngx-logger";
import {AlertController} from "@ionic/angular/standalone";
import {TranslateService} from "@ngx-translate/core";
import {
	OrderEventCalendarWithSpecialistWidgetComponent
} from "@tenant/event/presentation/ui/page/calendar-with-specialists/v2/component/elements-on-calendar/order-event.calendar-with-specialist.widget.component";
import {
	AbsenceEventCalendarWithSpecialistWidgetComponent
} from "@tenant/event/presentation/ui/page/calendar-with-specialists/v2/component/elements-on-calendar/absence-event.calendar-with-specialist.widget.component";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {
	CalendarWithSpecialistsQueries
} from "@tenant/event/infrastructure/state/calendar-with-specialists/calendar–with-specialists.queries";
import {Store} from "@ngxs/store";
import {firstValueFrom} from "rxjs";
import {OrderActions} from "@tenant/order/order/infrastructure/state/order/order.actions";
import {IMember} from "@tenant/member/member/domain/interface/i.member";
import EAbsence from "@tenant/member/absence/domain/entity/e.absence";
import {AbsenceDataActions} from "@tenant/member/absence/infrastructure/state/data/absence.data.actions";

type DATA = IEvent_V2<{ order: IOrder.DTO; service: IOrderServiceDto; } | IAbsence.DTO>;

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		OrderEventCalendarWithSpecialistWidgetComponent,
		AbsenceEventCalendarWithSpecialistWidgetComponent,
		DatePipe
	],
	selector: 'app-event-calendar-with-specialists-widget-component',
	standalone: true,
	template: `
		@if (isOrder(item)) {
			<app-order-event-calendar-with-specialist-widget-component [event]="item"/>
		}
		@if (isAbsence(item)) {
			<app-absence-event-calendar-with-specialist-widget-component [event]="item"/>
		}
		@if (draggable) {

			<div
				data-dragging="position"
				class="overflow-hidden absolute bg-black/50 bg-opacity-50 border-2 border-blue-500 bottom-0 left-0 p-1 right-0 rounded-md text-white top-0">
				@if (temporaryInformationAboutNewStartAndEnd) {
					<div
						data-dragging="position"
						class="h-full py-1 text-white flex flex-col justify-between">
						<div data-dragging="position" class="w-full text-center">
							{{ temporaryInformationAboutNewStartAndEnd.start | date: 'HH:mm' }}
						</div>
						<div data-dragging="position" class="w-full text-center">
							{{ temporaryInformationAboutNewStartAndEnd.end | date: 'HH:mm' }}
						</div>
					</div>
				}
			</div>
			<div
				class="-top-1 absolute bg-blue-500 h-3 left-1/2 rounded-full w-3"
				[style.transform]="'translate(-50%, 0)'">
			</div>
			<div
				data-dragging="top"
				class="-top-2 w-full absolute bg-transparent h-5 left-0 right-0 rounded-full cursor-ns-resize">
			</div>
			<div
				class="-bottom-1 absolute bg-blue-500 h-3  left-1/2 rounded-full w-3"
				[style.transform]="'translate(-50%, 0)'">
			</div>
			<div
				data-dragging="bottom"
				class="-bottom-2 w-full absolute bg-transparent h-5 left-0 right-0 rounded-full cursor-ns-resize">
			</div>
		}
	`,
	host: {
		class: 'absolute w-[calc(100%-20px)]',
		'[class.cursor-all-scroll]': 'draggable',
		'[class.select-none]': 'draggable'
	}
})
export class EventCalendarWithSpecialistWidgetComponent {

	@Input({required: true})
	public item!: DATA;

	readonly orderEventCalendarWithSpecialistWidgetComponent = viewChild(OrderEventCalendarWithSpecialistWidgetComponent);

	readonly absenceEventCalendarWithSpecialistWidgetComponent = viewChild(AbsenceEventCalendarWithSpecialistWidgetComponent);

	@SelectSnapshot(CalendarWithSpecialistsQueries.start)
	public selectedDate!: DateTime;
	public readonly calendarWithSpecialistLocaStateService = inject(CalendarWithSpecialistLocaStateService);
	public readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

	@HostBinding('style.touch-action')
	public touchAction = 'auto';

	@HostBinding('style.z-index')
	public zIndex = 3;

	@HostBinding('attr.data-is-event')
	public isEvent = true;

	@HostBinding('attr.data-draggable')
	public draggable = false;

	public temporaryInformationAboutNewStartAndEnd: { start: string, end: string } | null = null;
	public temporaryNewMember: IMember.DTO | null = null;
	public snapshotOfOriginalPosition: { top: number, height: number } | null = null;
	public previousData: {
		member: IMember.DTO | undefined;
		htmlParent: HTMLElement | null | undefined;
		memberId: string | undefined;
	} | null = null;
	private readonly ngxLogger = inject(NGXLogger);
	private readonly store = inject(Store);
	private readonly renderer2 = inject(Renderer2);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);
	private readonly alertController = inject(AlertController);
	private readonly translateService = inject(TranslateService);
	private saveInProgress = false;

	@HostBinding('style.top')
	public get top() {
		let startDateTime = DateTime.fromISO(this.item.start);
		if (startDateTime < this.selectedDate) {
			startDateTime = this.selectedDate;
		}
		const minutes = startDateTime.diff(startDateTime.startOf('day'), 'minutes').minutes;
		return `${(minutes * this.calendarWithSpecialistLocaStateService.oneMinuteForPx) + this.calendarWithSpecialistLocaStateService.specialistCellHeightForPx}px`;
	}

	@HostBinding('style.height')
	public get height() {
		let endDateTime = DateTime.fromISO(this.item.end);
		if (endDateTime > this.selectedDate.endOf('day')) {
			endDateTime = this.selectedDate.endOf('day');
		}
		let startDateTime = DateTime.fromISO(this.item.start);
		if (startDateTime < this.selectedDate) {
			startDateTime = this.selectedDate;
		}
		const duration = endDateTime.diff(startDateTime, 'minutes').minutes;
		return `${(duration * this.calendarWithSpecialistLocaStateService.oneMinuteForPx)}px`;
	}

	// Hover
	@HostListener('mouseenter')
	public onMouseEnter() {
		const orderEventCalendarWithSpecialistWidgetComponent = this.orderEventCalendarWithSpecialistWidgetComponent();
		if (orderEventCalendarWithSpecialistWidgetComponent) {
			this.renderer2.addClass(this.elementRef.nativeElement, 'z-20');
			if (this.elementRef.nativeElement.clientHeight < orderEventCalendarWithSpecialistWidgetComponent.elementRef.nativeElement.scrollHeight) {
				orderEventCalendarWithSpecialistWidgetComponent.elementRef.nativeElement.classList.remove('bottom-0');
			}
		}
	}

	@HostListener('mouseleave')
	public onMouseLeave() {
		const orderEventCalendarWithSpecialistWidgetComponent = this.orderEventCalendarWithSpecialistWidgetComponent();
		if (orderEventCalendarWithSpecialistWidgetComponent) {
			if (this.elementRef.nativeElement.clientHeight < orderEventCalendarWithSpecialistWidgetComponent.elementRef.nativeElement.scrollHeight) {
				orderEventCalendarWithSpecialistWidgetComponent.elementRef.nativeElement.classList.add('bottom-0');
			}
			this.renderer2.removeClass(this.elementRef.nativeElement, 'z-20');
		}
	}

	@HostListener('tap', ['$event'])
	onTap(event: any) {
		if (this.draggable) {
			this.ngxLogger.debug('EventCalendarWithSpecialistWidgetComponent:onTap');
			return;
		}
		this.ngxLogger.debug('tap event detected:', event);
		this.orderEventCalendarWithSpecialistWidgetComponent()?.onClick?.();
		this.absenceEventCalendarWithSpecialistWidgetComponent()?.onClick?.();
	}

	// If draggable is enabled and user press outside of the event, then disable draggable mode
	@HostListener('document:tap', ['$event'])
	public onDocumentTap(event: HammerInput) {
		if (this.draggable && !this.elementRef.nativeElement.contains(event.target)) {
			this.ngxLogger.debug('EventCalendarWithSpecialistWidgetComponent:onDocumentTap');
			this.toggleMode(false).then();
			// Prevent event propagation
			event.preventDefault();
			event.srcEvent.preventDefault();
			// Prevent bubbling
			event.srcEvent.stopPropagation();
		}
	}

	@HostListener('press', ['$event'])
	public onPress(event: HammerInput) {
		if (this.draggable) {
			this.ngxLogger.debug('EventCalendarWithSpecialistWidgetComponent:onPress');
			return;
		}
		this.ngxLogger.debug('press event detected:', event);
		// Додайте вашу логіку тут
		this.toggleMode(true);
	}

	public changeMember(member: IMember.EntityRaw) {
		this.temporaryNewMember = member;
	}

	/**
	 * Updates the temporary information about the new start and end times of the event
	 * based on the current position and size of the element in the DOM.
	 */
	public someUpdateFromExternal() {
		const rect = this.elementRef.nativeElement.getBoundingClientRect();
		const parentRect = this.elementRef.nativeElement?.parentElement?.getBoundingClientRect?.();
		if (!parentRect) {
			this.ngxLogger.error('EventCalendarWithSpecialistWidgetComponent:someUpdateFromExternal:parentRect is not defined');
			return;
		}

		const newStartPosition = ((rect.top - parentRect.top) - this.calendarWithSpecialistLocaStateService.specialistCellHeightForPx);

		// Calculate new start and duration
		const newStartInMinutes = newStartPosition / this.calendarWithSpecialistLocaStateService.oneMinuteForPx;
		const newDurationInMinutes = rect.height / this.calendarWithSpecialistLocaStateService.oneMinuteForPx;

		const startDateTime = DateTime.fromISO(this.item.start);
		const newStartDateTime = startDateTime.startOf('day').plus({minutes: newStartInMinutes}).startOf('second');
		const newEndDateTime = newStartDateTime.plus({minutes: newDurationInMinutes}).startOf('second');

		this.temporaryInformationAboutNewStartAndEnd = {
			start: newStartDateTime.toJSDate().toISOString(),
			end: newEndDateTime.toJSDate().toISOString()
		};
		this.changeDetectorRef.detectChanges();
	}

	public async toggleMode(force?: boolean) {

		this.ngxLogger.debug('EventCalendarWithSpecialistWidgetComponent:toggleMode');
		this.draggable = force ?? !this.draggable;
		this.changeDetectorRef.detectChanges();

		if (this.draggable) {
			this.calendarWithSpecialistLocaStateService.setEventCalendarWithSpecialistWidgetComponent(this);
		} else {
			this.calendarWithSpecialistLocaStateService.setEventCalendarWithSpecialistWidgetComponent(null)
		}

		if (this.draggable) {
			this.snapshotOriginalPosition();
		}

		if (!this.draggable && (this.temporaryInformationAboutNewStartAndEnd || this.temporaryNewMember) && !this.saveInProgress) {

			this.saveInProgress = true;

			const answer = await this.confirmChanges();

			if (!answer) {
				this.temporaryNewMember = null;
				this.temporaryInformationAboutNewStartAndEnd = null;
				this.saveInProgress = false;
				this.restoreOriginalPosition();
				return false;
			}

			if (this.temporaryInformationAboutNewStartAndEnd) {

				// Update event and save new start and end in server

				this.item.start = this.temporaryInformationAboutNewStartAndEnd.start;
				this.item.end = this.temporaryInformationAboutNewStartAndEnd.end;

				if (this.isOrder(this.item)) {
					this.item.originalData.service.orderAppointmentDetails.start = this.temporaryInformationAboutNewStartAndEnd.start;
					this.item.originalData.service.orderAppointmentDetails.end = this.temporaryInformationAboutNewStartAndEnd.end;
				}

				if (this.isAbsence(this.item)) {
					this.item.originalData.start = this.temporaryInformationAboutNewStartAndEnd.start;
					this.item.originalData.end = this.temporaryInformationAboutNewStartAndEnd.end;
				}

			}

			if (this.temporaryNewMember) {
				// Update event and save new member in server

				if (this.isOrder(this.item)) {
					this.item.originalData.service.orderAppointmentDetails.specialists = [{
						object: 'SpecialistDto',
						member: this.temporaryNewMember,
						wasSelectedAnybody: false
					}];
				}

				if (this.isAbsence(this.item)) {
					this.item.originalData.members = [this.temporaryNewMember];
				}
			}

			if (this.isOrder(this.item)) {
				const durationInSeconds = DateTime.fromISO(this.item.end).diff(DateTime.fromISO(this.item.start), 'seconds').seconds;
				const editedService = this.item.originalData.service;
				editedService.serviceSnapshot.durationVersions[0].durationInSeconds = durationInSeconds;

				const {order} = this.item.originalData;
				const action = new OrderActions.UpdateItem({
					...order,
					services: order.services.map(service => {
						if (editedService._id === service._id) {
							return {
								...service,
								serviceSnapshot: editedService.serviceSnapshot,
								orderAppointmentDetails: editedService.orderAppointmentDetails,
								_id: editedService._id,
								status: editedService.status
							};
						}
						return service;
					})
				})
				const action$ = this.store.dispatch(action);
				await firstValueFrom(action$);
				this.item = structuredClone(this.item);
			}

			if (this.isAbsence(this.item)) {
				const entity = EAbsence.fromDTO(this.item.originalData);
				const action = new AbsenceDataActions.UpdateItem(entity);
				const action$ = this.store.dispatch(action);
				await firstValueFrom(action$);
				this.item = structuredClone(this.item);
			}

			this.temporaryNewMember = null;
			this.temporaryInformationAboutNewStartAndEnd = null;
			this.saveInProgress = false;

			this.changeDetectorRef.detectChanges();
			return true;

		}

		this.changeDetectorRef.detectChanges();
		return false;

	}

	public isOrder(event: DATA): event is IEvent_V2<{ order: IOrder.DTO; service: IOrderServiceDto; }> {
		return event.is === 'order';
	}

	public isAbsence(event: DATA): event is IEvent_V2<IAbsence.DTO> {
		return event.is === 'absence';
	}

	private snapshotOriginalPosition() {

		this.snapshotOfOriginalPosition = {
			top: this.elementRef.nativeElement.offsetTop,
			height: this.elementRef.nativeElement.offsetHeight
		};

		if (this.isOrder(this.item)) {
			this.previousData = {
				memberId: undefined,
				member: this.item.originalData.service.orderAppointmentDetails.specialists[0].member,
				htmlParent: this.elementRef.nativeElement.parentElement
			}
		}

		if (this.isAbsence(this.item)) {
			const member = this.item.originalData.members[0];
			this.previousData = {
				memberId: member._id,
				member,
				htmlParent: this.elementRef.nativeElement.parentElement
			}
		}

	}

	private restoreOriginalPosition() {
		if (this.snapshotOfOriginalPosition) {
			this.renderer2.setStyle(this.elementRef.nativeElement, 'top', `${this.snapshotOfOriginalPosition.top}px`);
			this.renderer2.setStyle(this.elementRef.nativeElement, 'height', `${this.snapshotOfOriginalPosition.height}px`);
		}
		this.snapshotOfOriginalPosition = null;

		if (this.previousData) {

			if (this.isOrder(this.item) && this.previousData.member) {
				this.item.originalData.service.orderAppointmentDetails.specialists[0].member = this.previousData.member;
			}

			if (this.isAbsence(this.item) && this.previousData.member) {
				this.item.originalData.members = [this.previousData.member];
			}

			if (this.previousData.htmlParent) {
				this.previousData.htmlParent.appendChild(this.elementRef.nativeElement);
			}

		}

		this.previousData = null;
	}

	private confirmChanges(): Promise<boolean> {
		return new Promise<boolean>((resolve) => {

			let message = this.translateService.instant('event.calendar-with-specialists.confirm-changes.message.default');
			let subHeader = undefined;

			if (this.isOrder(this.item)) {

				const prevMember = this.previousData?.member;

				if (this.temporaryNewMember && prevMember && this.temporaryNewMember._id !== prevMember._id && !this.temporaryNewMember.assignments.service.full) {

					const {service} = this.item.originalData;
					const newMemberCanServerTheService = this.temporaryNewMember.assignments.service.include.some(({service: includedService}) => {
						return service._id === includedService._id;
					});

					if (!newMemberCanServerTheService) {
						subHeader = this.translateService.instant('event.calendar-with-specialists.confirm-changes.subHeader.important');
						message = this.translateService.instant('event.calendar-with-specialists.confirm-changes.message.important');
					}

				}

			}

			this.alertController.create({
				header: this.translateService.instant('keyword.capitalize.confirm'),
				subHeader,
				message,
				buttons: [
					{
						text: this.translateService.instant('keyword.capitalize.cancel'),
						role: 'cancel',
						handler: () => resolve(false)
					},
					{
						text: this.translateService.instant('keyword.capitalize.yes'),
						cssClass: subHeader ? '!text-red-500' : '',
						handler: () => resolve(true)
					}
				]
			}).then(alert => alert.present());
		});
	}

}
