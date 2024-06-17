import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	HostBinding,
	HostListener,
	inject,
	Input,
	ViewChild,
	ViewEncapsulation
} from "@angular/core";
import {DatePipe, NgIf} from "@angular/common";
import {
	CalendarWithSpecialistLocaStateService
} from "@page/event/calendar-with-specialists/v2/calendar-with-specialist.loca.state.service";
import {IEvent_V2} from "@event/domain";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";
import {IAbsenceDto} from "@absence/external/interface/i.absence.dto";
import {
	OrderEventCalendarWithSpecialistWidgetComponent
} from "@page/event/calendar-with-specialists/v2/component/order-event.calendar-with-specialist.widget.component";
import {
	AbsenceEventCalendarWithSpecialistWidgetComponent
} from "@page/event/calendar-with-specialists/v2/component/absence-event.calendar-with-specialist.widget.component";
import {DateTime} from "luxon";
import {RIMember} from "@member/domain";
import {UpdateServiceOrderApiAdapter} from "@order/external/adapter/api/update.service.order.api.adapter";
import {UpdateAbsenceApiAdapter} from "@absence/external/adapter/api/update.order.api.adapter";
import {NGXLogger} from "ngx-logger";
import {AlertController} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";

type DATA = IEvent_V2<{ order: IOrderDto; service: IOrderServiceDto; } | IAbsenceDto>;

@Component({
	selector: 'app-event-calendar-with-specialists-widget-component',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgIf,
		OrderEventCalendarWithSpecialistWidgetComponent,
		AbsenceEventCalendarWithSpecialistWidgetComponent,
		DatePipe
	],
	template: `
		<app-order-event-calendar-with-specialist-widget-component *ngIf="isOrder(item)" [event]="item"/>
		<app-absence-event-calendar-with-specialist-widget-component *ngIf="isAbsence(item)" [event]="item"/>
		<ng-container *ngIf="draggable">

			<div
				data-dragging="position"
				class="overflow-hidden absolute bg-black/50 bg-opacity-50 border-2 border-blue-500 bottom-0 left-0 p-1 right-0 rounded-md text-white top-0">
				<div
					data-dragging="position"
					class="h-full py-1 text-white flex flex-col justify-between"
					*ngIf="temporaryInformationAboutNewStartAndEnd">
					<div data-dragging="position" class="w-full text-center">
						{{ temporaryInformationAboutNewStartAndEnd.start | date: 'HH:mm' }}
					</div>
					<div data-dragging="position" class="w-full text-center">
						{{ temporaryInformationAboutNewStartAndEnd.end | date: 'HH:mm' }}
					</div>
				</div>
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
		</ng-container>
	`
})
export class EventCalendarWithSpecialistWidgetComponent {

	@Input({required: true})
	public item!: DATA;

	@ViewChild(OrderEventCalendarWithSpecialistWidgetComponent)
	private orderEventCalendarWithSpecialistWidgetComponent!: OrderEventCalendarWithSpecialistWidgetComponent;

	@ViewChild(AbsenceEventCalendarWithSpecialistWidgetComponent)
	private absenceEventCalendarWithSpecialistWidgetComponent!: AbsenceEventCalendarWithSpecialistWidgetComponent;

	@HostBinding()
	public get class() {
		return 'absolute';
	}

	@HostBinding('style.touch-action')
	public touchAction = 'auto';

	@HostBinding('attr.data-is-event')
	public isEvent = true;

	@HostBinding('attr.data-draggable')
	public draggable = false;

	@HostBinding('class.cursor-all-scroll')
	public get cursorAllScroll() {
		return this.draggable;
	}

	@HostBinding('class.select-none')
	public get selectNone() {
		return this.draggable;
	}

	@HostBinding('style.top')
	public get top() {
		const startDateTime = DateTime.fromISO(this.item.start);
		const minutes = startDateTime.diff(DateTime.fromISO(this.item.start).startOf('day'), 'minutes').minutes;
		return `${(minutes * this.calendarWithSpecialistLocaStateService.oneMinuteForPx) + this.calendarWithSpecialistLocaStateService.specialistCellHeightForPx}px`;
	}

	@HostBinding('style.height')
	public get height() {
		const endDateTime = DateTime.fromISO(this.item.end);
		const startDateTime = DateTime.fromISO(this.item.start);
		const duration = endDateTime.diff(startDateTime, 'minutes').minutes;
		return `${(duration * this.calendarWithSpecialistLocaStateService.oneMinuteForPx)}px`;
	}

	@HostBinding('style.width')
	public get width() {
		return '100%';
	}

	private readonly ngxLogger = inject(NGXLogger);

	// Hover
	@HostListener('mouseenter')
	public onMouseEnter() {
		this.ngxLogger.debug('EventCalendarWithSpecialistWidgetComponent:onMouseEnter');
		if (this.orderEventCalendarWithSpecialistWidgetComponent) {
			this.elementRef.nativeElement.classList.add('z-20');
			if (this.elementRef.nativeElement.clientHeight < this.orderEventCalendarWithSpecialistWidgetComponent.elementRef.nativeElement.scrollHeight) {
				this.orderEventCalendarWithSpecialistWidgetComponent.elementRef.nativeElement.classList.remove('bottom-0');
			}
		}
	}

	@HostListener('mouseleave')
	public onMouseLeave() {
		this.ngxLogger.debug('EventCalendarWithSpecialistWidgetComponent:onMouseLeave');
		if (this.orderEventCalendarWithSpecialistWidgetComponent) {
			if (this.elementRef.nativeElement.clientHeight < this.orderEventCalendarWithSpecialistWidgetComponent.elementRef.nativeElement.scrollHeight) {
				this.orderEventCalendarWithSpecialistWidgetComponent.elementRef.nativeElement.classList.add('bottom-0');
			}
			this.elementRef.nativeElement.classList.remove('z-20');
		}
	}

	@HostListener('tap', ['$event'])
	onTap(event: any) {
		if (this.draggable) {
			this.ngxLogger.debug('EventCalendarWithSpecialistWidgetComponent:onTap');
			return;
		}
		this.ngxLogger.debug('tap event detected:', event);
		this.orderEventCalendarWithSpecialistWidgetComponent?.onClick?.();
		this.absenceEventCalendarWithSpecialistWidgetComponent?.onClick?.();
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

	public temporaryInformationAboutNewStartAndEnd: { start: string, end: string } | null = null;
	public temporaryNewMember: RIMember | null = null;
	public snapshottedOriginalPosition: { top: number, height: number } | null = null;
	public previousData: {
		member: RIMember | undefined;
		htmlParent: HTMLElement | null | undefined;
		memberId: string | undefined;
	} | null = null;

	public changeMember(member: RIMember) {
		this.temporaryNewMember = member;
	}

	public someUpdateFromExternal() {
		const rect = this.elementRef.nativeElement.getBoundingClientRect();
		const parentRect = this.elementRef.nativeElement?.parentElement?.getBoundingClientRect?.();
		if (!parentRect) {
			console.error('Parent element not found');
			return;
		}
		// Calculate new start and duration
		const newStartInMinutes = ((rect.top - parentRect.top) - this.calendarWithSpecialistLocaStateService.specialistCellHeightForPx) / this.calendarWithSpecialistLocaStateService.oneMinuteForPx;
		const newDurationInMinutes = rect.height / this.calendarWithSpecialistLocaStateService.oneMinuteForPx;

		const startDateTime = DateTime.fromISO(this.item.start);
		const newStartDateTime = startDateTime.startOf('day').plus({minutes: newStartInMinutes});
		const newEndDateTime = newStartDateTime.plus({minutes: newDurationInMinutes});

		this.temporaryInformationAboutNewStartAndEnd = {
			start: newStartDateTime.toJSDate().toISOString(),
			end: newEndDateTime.toJSDate().toISOString()
		};
		this.changeDetectorRef.detectChanges();

	}

	public readonly calendarWithSpecialistLocaStateService = inject(CalendarWithSpecialistLocaStateService);
	public readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);
	private readonly updateServiceOrderApiAdapter = inject(UpdateServiceOrderApiAdapter);
	private readonly updateAbsenceApiAdapter = inject(UpdateAbsenceApiAdapter);
	private readonly alertController = inject(AlertController);
	private readonly translateService = inject(TranslateService);

	private saveInProgress = false;

	public async toggleMode(force?: boolean) {
		this.ngxLogger.debug('EventCalendarWithSpecialistWidgetComponent:toggleMode');
		this.draggable = force ?? !this.draggable;
		this.changeDetectorRef.detectChanges();
		this.draggable && this.calendarWithSpecialistLocaStateService.setEventCalendarWithSpecialistWidgetComponent(this);
		!this.draggable && this.calendarWithSpecialistLocaStateService.setEventCalendarWithSpecialistWidgetComponent(null);

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
					}];
				}

				if (this.isAbsence(this.item)) {
					this.item.originalData.memberIds = [this.temporaryNewMember._id];
				}
			}

			if (this.isOrder(this.item)) {
				await this.updateServiceOrderApiAdapter.executeAsync(this.item.originalData.order._id, this.item.originalData.service);
				this.item = structuredClone(this.item);
			}

			if (this.isAbsence(this.item)) {
				await this.updateAbsenceApiAdapter.executeAsync(this.item.originalData);
				this.item = structuredClone(this.item);
			}

			this.temporaryNewMember = null;
			this.temporaryInformationAboutNewStartAndEnd = null;
			this.saveInProgress = false;

			return true;

		}

		this.changeDetectorRef.detectChanges();
		return false;

	}

	public isOrder(event: DATA): event is IEvent_V2<{ order: IOrderDto; service: IOrderServiceDto; }> {
		return event.is === 'order';
	}

	public isAbsence(event: DATA): event is IEvent_V2<IAbsenceDto> {
		return event.is === 'absence';
	}

	public snapshotOriginalPosition() {

		this.snapshottedOriginalPosition = {
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
			this.previousData = {
				member: undefined,
				memberId: this.item.originalData.memberIds[0],
				htmlParent: this.elementRef.nativeElement.parentElement
			}
		}

	}

	public restoreOriginalPosition() {
		if (this.snapshottedOriginalPosition) {
			this.elementRef.nativeElement.style.top = `${this.snapshottedOriginalPosition.top}px`;
			this.elementRef.nativeElement.style.height = `${this.snapshottedOriginalPosition.height}px`;
		}
		this.snapshottedOriginalPosition = null;

		if (this.previousData) {

			if (this.isOrder(this.item) && this.previousData.member) {
				this.item.originalData.service.orderAppointmentDetails.specialists[0].member = this.previousData.member;
			}

			if (this.isAbsence(this.item) && this.previousData.memberId) {
				this.item.originalData.memberIds = [this.previousData.memberId];
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

				if (this.temporaryNewMember && !this.temporaryNewMember.assignments.service.full) {

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
