import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	HostBinding,
	HostListener,
	inject,
	model,
	Renderer2,
	viewChild,
	ViewEncapsulation
} from "@angular/core";
import {DatePipe} from "@angular/common";
import CalendarWithSpecialistLocaStateService
	from "@tenant/event/presentation/ui/page/calendar-with-specialists/v3/calendar-with-specialist.loca.state.service";
import {DateTime} from "luxon";
import {NGXLogger} from "ngx-logger";
import {AlertController} from "@ionic/angular/standalone";
import {TranslateService} from "@ngx-translate/core";
import {
	OrderEventCalendarWithSpecialistWidgetComponent
} from "@src/tenant/event/presentation/ui/page/calendar-with-specialists/v3/component/elements-on-calendar/order-service.event.calendar-with-specialist.widget.component";
import {
	AbsenceEventCalendarWithSpecialistWidgetComponent
} from "@src/tenant/event/presentation/ui/page/calendar-with-specialists/v3/component/elements-on-calendar/absence.event.calendar-with-specialist.widget.component";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {
	CalendarWithSpecialistsQueries
} from "@tenant/event/infrastructure/state/calendar-with-specialists/calendar–with-specialists.queries";
import {Store} from "@ngxs/store";
import {firstValueFrom} from "rxjs";
import {IMember} from "@tenant/member/member/domain/interface/i.member";
import EAbsence from "@tenant/member/absence/domain/entity/e.absence";
import {AbsenceDataActions} from "@tenant/member/absence/infrastructure/state/data/absence.data.actions";
import EOrderService from "@tenant/order/order-service/domain/entity/e.order-service";
import {
	OrderServiceDataActions
} from "@tenant/order/order-service/infrastructure/state/data/order-service.data.actions";


type DATA = EOrderService | EAbsence;

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
    DatePipe,
    OrderEventCalendarWithSpecialistWidgetComponent,
    AbsenceEventCalendarWithSpecialistWidgetComponent
],
	selector: 'app-event-calendar-with-specialists-widget-component',
	standalone: true,
	template: `
		@let entity = item();
		@if (isEOrderService(entity)) {
			<app-order-service-event-calendar-with-specialist-widget-component [orderService]="entity"/>
		}
		@if (isEAbsence(entity)) {
			<app-absence-event-calendar-with-specialist-widget-component [absence]="entity"/>
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

	public readonly item = model.required<DATA>();

	public readonly orderEventCalendarWithSpecialistWidgetComponent = viewChild(OrderEventCalendarWithSpecialistWidgetComponent);

	public readonly absenceEventCalendarWithSpecialistWidgetComponent = viewChild(AbsenceEventCalendarWithSpecialistWidgetComponent);

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
		let start: string | null = null;

		const item = this.item();
		if (this.isEOrderService(item)) {
			start = item.orderAppointmentDetails.start;
			if (!start) {
				this.ngxLogger.error('EventCalendarWithSpecialistWidgetComponent:top:item.orderAppointmentDetails.start is not defined');
				return '0px';
			}
		}

		if (this.isEAbsence(item)) {
			start = item.start;
			if (!start) {
				this.ngxLogger.error('EventCalendarWithSpecialistWidgetComponent:top:item.start is not defined');
				return '0px';
			}
		}

		if (!start) {
			this.ngxLogger.error('EventCalendarWithSpecialistWidgetComponent:top:start is not defined');
			return '0px';
		}
		let startDateTime = DateTime.fromISO(start);
		if (startDateTime < this.selectedDate) {
			startDateTime = this.selectedDate;
		}
		const minutes = startDateTime.diff(startDateTime.startOf('day'), 'minutes').minutes;
		return `${(minutes * this.calendarWithSpecialistLocaStateService.oneMinuteForPx) + this.calendarWithSpecialistLocaStateService.specialistCellHeightForPx}px`;
	}

	@HostBinding('style.height')
	public get height() {
		let start: string | null = null;
		let end: string | null = null;

		const item = this.item();

		if (this.isEOrderService(item)) {
			start = item.orderAppointmentDetails.start;
			end = item.orderAppointmentDetails.end;
			if (!start || !end) {
				this.ngxLogger.error('EventCalendarWithSpecialistWidgetComponent:height:item.orderAppointmentDetails.start or item.orderAppointmentDetails.end is not defined');
				return '0px';
			}
		}

		if (this.isEAbsence(item)) {
			start = item.start;
			end = item.end;
			if (!start || !end) {
				this.ngxLogger.error('EventCalendarWithSpecialistWidgetComponent:height:item.start or item.end is not defined');
				return '0px';
			}
		}

		if (!start || !end) {
			this.ngxLogger.error('EventCalendarWithSpecialistWidgetComponent:height:start or end is not defined');
			return '0px';
		}

		let endDateTime = DateTime.fromISO(end);
		if (endDateTime > this.selectedDate.endOf('day')) {
			endDateTime = this.selectedDate.endOf('day');
		}
		let startDateTime = DateTime.fromISO(start);
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

		let start: string | null = null;
		const item = this.item();
		if (this.isEOrderService(item)) {
			start = item.orderAppointmentDetails.start;
			if (!start) {
				this.ngxLogger.error('EventCalendarWithSpecialistWidgetComponent:someUpdateFromExternal:item.orderAppointmentDetails.start is not defined');
				return;
			}
		}

		if (this.isEAbsence(item)) {
			start = item.start;
			if (!start) {
				this.ngxLogger.error('EventCalendarWithSpecialistWidgetComponent:someUpdateFromExternal:item.start is not defined');
				return;
			}
		}

		if (!start) {
			this.ngxLogger.error('EventCalendarWithSpecialistWidgetComponent:someUpdateFromExternal:start is not defined');
			return;
		}

		const startDateTime = DateTime.fromISO(start);
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

			const item = this.item();

			if (this.isEOrderService(item)) {

				const orderService = structuredClone(item);

				if (this.temporaryInformationAboutNewStartAndEnd) {

					// Update event and save new start and end in server
					orderService.orderAppointmentDetails.start = this.temporaryInformationAboutNewStartAndEnd.start;
					orderService.orderAppointmentDetails.end = this.temporaryInformationAboutNewStartAndEnd.end;

				}

				if (this.temporaryNewMember) {
					// Update event and save new member in server

					orderService.orderAppointmentDetails.specialists = [{
						object: 'SpecialistDto',
						member: this.temporaryNewMember,
						wasSelectedAnybody: false
					}];
				}


				const start = orderService.orderAppointmentDetails.start;
				const end = orderService.orderAppointmentDetails.end;
				const durationInSeconds = DateTime.fromISO(end).diff(DateTime.fromISO(start), 'seconds').seconds;
				orderService.serviceSnapshot.durationVersions[0].durationInSeconds = durationInSeconds;
				const newEOrderService = EOrderService.fromRaw({
					...orderService,
					serviceSnapshot: orderService.serviceSnapshot,
					orderAppointmentDetails: orderService.orderAppointmentDetails,
					_id: orderService._id,
					status: orderService.status
				});

				const action = new OrderServiceDataActions.UpdateItem(newEOrderService)
				const action$ = this.store.dispatch(action);
				await firstValueFrom(action$);
				this.item.set(newEOrderService);
			}

			if (this.isEAbsence(item)) {

				const absence = structuredClone(item);

				if (this.temporaryInformationAboutNewStartAndEnd) {

					absence.start = this.temporaryInformationAboutNewStartAndEnd.start;
					absence.end = this.temporaryInformationAboutNewStartAndEnd.end;

				}

				if (this.temporaryNewMember) {
					// Update event and save new member in server
					absence.members = [this.temporaryNewMember];
				}

				const newEAbsence = EAbsence.fromRaw(absence);

				const action = new AbsenceDataActions.UpdateItem(newEAbsence);
				const action$ = this.store.dispatch(action);
				await firstValueFrom(action$);
				this.item.set(EAbsence.fromRaw(item));
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

	public isEOrderService(event: DATA): event is EOrderService {
		return event instanceof EOrderService;
	}

	public isEAbsence(event: DATA): event is EAbsence {
		return event instanceof EAbsence;
	}

	private snapshotOriginalPosition() {

		this.snapshotOfOriginalPosition = {
			top: this.elementRef.nativeElement.offsetTop,
			height: this.elementRef.nativeElement.offsetHeight
		};

		const item = this.item();

		if (this.isEOrderService(item)) {
			this.previousData = {
				memberId: undefined,
				member: item.orderAppointmentDetails.specialists[0].member,
				htmlParent: this.elementRef.nativeElement.parentElement
			}
		}

		if (this.isEAbsence(item)) {
			const member = item.members[0];
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


		const item = structuredClone(this.item());
		if (this.previousData) {

			if (this.isEOrderService(item) && this.previousData.member) {
				item.orderAppointmentDetails.specialists[0].member = this.previousData.member;
				this.item.set(EOrderService.fromRaw(item));
			}

			if (this.isEAbsence(item) && this.previousData.member) {
				item.members = [this.previousData.member];
				this.item.set(EAbsence.fromRaw(item));
			}

			if (this.previousData.htmlParent) {
				this.previousData.htmlParent.appendChild(this.elementRef.nativeElement);
			}

		}

		this.previousData = null;
	}

	private async confirmChanges(): Promise<boolean> {

		let message = this.translateService.instant('event.calendar-with-specialists.confirm-changes.message.default');
		let subHeader = undefined;


		const item = this.item();
		if (this.isEOrderService(item)) {

			const prevMember = this.previousData?.member;

			if (this.temporaryNewMember && prevMember && this.temporaryNewMember._id !== prevMember._id && !this.temporaryNewMember.assignments.service.full) {

				const service = item;
				const newMemberCanServerTheService = this.temporaryNewMember.assignments.service.include.some(({service: includedService}) => {
					return service._id === includedService._id;
				});

				if (!newMemberCanServerTheService) {
					subHeader = this.translateService.instant('event.calendar-with-specialists.confirm-changes.subHeader.important');
					message = this.translateService.instant('event.calendar-with-specialists.confirm-changes.message.important');
				}

			}

		}

		const alert = await this.alertController.create({
			header: this.translateService.instant('keyword.capitalize.confirm'),
			subHeader,
			message,
			buttons: [
				{
					text: this.translateService.instant('keyword.capitalize.cancel'),
					role: 'cancel',
					handler: () => false
				},
				{
					text: this.translateService.instant('keyword.capitalize.yes'),
					role: 'confirm',
					cssClass: subHeader ? '!text-red-500' : '',
					handler: () => true
				}
			]
		});

		await alert.present();

		const result = await alert.onDidDismiss();

		return result.role === 'confirm';

	}

}
