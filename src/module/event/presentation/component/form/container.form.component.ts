import {
	Component,
	inject,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	QueryList,
	SimpleChange,
	SimpleChanges,
	ViewChildren
} from "@angular/core";
import {
	ButtonSaveContainerComponent
} from "@utility/presentation/component/container/button-save/button-save.container.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";
import {GeneralDetailsComponent} from "@event/presentation/component/details/general.details.component";
import {DatePipe, NgIf} from "@angular/common";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {ReactiveFormsModule} from "@angular/forms";
import {
	SelectTimeSlotComponent
} from "@event/presentation/component/form/select-time-slot/index/select-time-slot.component";
import {ServicesComponent} from "@event/presentation/component/form/services/services.component";
import {TranslateModule} from "@ngx-translate/core";
import {Store} from "@ngxs/store";
import {Router} from "@angular/router";
import {SlotsService} from "@event/presentation/component/form/select-time-slot/slots.service";
import {NGXLogger} from "ngx-logger";
import {EventForm} from "@event/presentation/form/event.form";
import {BackButtonComponent} from "@utility/presentation/component/button/back.button.component";
import {combineLatest, filter, map, tap} from "rxjs";
import {IEvent, MEvent, RMIEvent} from "@event/domain";
import {ClientState} from "@client/state/client/client.state";
import {RIClient} from "@client/domain";
import {is} from "thiis";
import {RISchedule} from "@utility/domain/interface/i.schedule";
import {IConfiguration, IPresentation, IService} from "@service/domain";
import {Reactive} from "@utility/cdk/reactive";
import {TimeInputComponent} from "@utility/presentation/component/input/time.input.component";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {DefaultInputDirective} from "@utility/presentation/directives/input/default.input.directive";
import {DefaultPanelComponent} from "@utility/presentation/component/panel/default.panel.component";
import * as Member from '@member/domain';
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";
import {RIMedia} from "@module/media/domain/interface/i.media";
import {
	CustomerTypeCustomerComponent
} from "@customer/presentation/component/form/by-customer-type/customer-type.customer.component";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";

@Component({
	selector: 'event-container-form-component',
	standalone: true,
	imports: [
		ButtonSaveContainerComponent,
		CardComponent,
		FormTextareaComponent,
		GeneralDetailsComponent,
		NgIf,
		PrimaryButtonDirective,
		ReactiveFormsModule,
		SelectTimeSlotComponent,
		ServicesComponent,
		TranslateModule,
		TimeInputComponent,
		FormInputComponent,
		DefaultInputDirective,
		DatePipe,
		DefaultPanelComponent,
		BackButtonComponent,
		CustomerTypeCustomerComponent,
	],
	providers: [
		SlotsService
	],
	templateUrl: './container.form.component.html'
})
export class ContainerFormComponent extends Reactive implements OnInit, OnChanges, OnDestroy {

	@Input()
	public orderServiceDto: IOrderServiceDto | undefined;

	@Input()
	public isEditMode = false;

	@Input()
	public backButtonComponent!: BackButtonComponent;

	@Input()
	public forceStart: string | undefined;

	@Input()
	public member: Member.RIMember | undefined;

	@Input()
	public callback: ((component: ContainerFormComponent, formValue: IEvent) => void) | null = null;

	private readonly store = inject(Store);
	public readonly slotsService = inject(SlotsService);
	public readonly router = inject(Router);
	private readonly logger = inject(NGXLogger);

	public readonly form = new EventForm();

	public specialist = '';
	public eventDurationInSeconds = 0;

	@ViewChildren(ServicesComponent)
	public servicesComponent!: QueryList<ServicesComponent>;

	@SelectSnapshot(ClientState.item)
	public readonly clientItem!: RIClient;

	public readonly client$ = this.store.select(ClientState.item).pipe(
		filter(is.not_undefined<RIClient>),
	);

	public get value(): RMIEvent {
		return MEvent.create(this.form.getRawValue() as unknown as IEvent);
	}

	public ngOnChanges(changes: SimpleChanges & {forceStart: SimpleChange}): void {
		const {forceStart} = changes;
		if (forceStart && forceStart.currentValue) {
			this.form.controls.start.patchValue(forceStart.currentValue);
		}
	}

	public ngOnInit(): void {

		this.form.controls.language.setValue(this.clientItem.businessSettings.baseLanguage);

		const clientAndService$ = combineLatest(
			[
				this.client$.pipe(filter(is.object)),
				this.form.controls.services.valueChanges.pipe(
					filter((services) => !!services?.length),
					map(({0: firstService}) => firstService),
					filter((firstService) => {
						// Allow only if specialist or duration is not the same
						// const newSpecialist = this.takeSpecialistFromService(firstService);
						const durationInSeconds = this.getEventDurationInSeconds(firstService);
						// this.specialist !== newSpecialist ||
						return this.eventDurationInSeconds !== durationInSeconds;
					}),
					// tap(this.setSpecialist.bind(this)),
					tap(this.setEventDuration.bind(this)),
				),
			]
		);

		clientAndService$
			.pipe(
				this.takeUntil()
			)
			.subscribe(({0: client, 1: services}) => {
				this.logger.debug('clientAndService$', client, services, this.slotsService.initialized.isTrue);

				this.slotsService
					.setSchedules((client?.schedules ?? []) as RISchedule[])
					.setSpecialist(this.specialist)
					.setEventDurationInSeconds(this.eventDurationInSeconds)
					.setSlotBuildingStrategy(client.bookingSettings.slotSettings.slotBuildingStrategy)
					.setSlotIntervalInSeconds(client.bookingSettings.slotSettings.slotIntervalInSeconds);

				if (this.slotsService.initialized.isTrue) {
					this.slotsService.initialized.doFalse();
					this.slotsService.initSlots().then();
				}

			});

		this.detectItem();

	}

	private getEventDurationInSeconds(service: IService): number {
		try {
			// Find the biggest duration version

			const {durationVersions} = service;
			this.logger.debug('getEventDurationInSeconds', durationVersions);
			const durationVersion = durationVersions.reduce((acc, curr) => {
				if (curr.durationInSeconds > acc.durationInSeconds) {
					return curr;
				}
				return acc;
			}, durationVersions[0]);

			return (durationVersion.durationInSeconds ?? 0) + (durationVersion.breakInSeconds ?? 0);

		} catch (e) {
			return 0;
		}
	}

	private setEventDuration(service: IService): this {
		this.eventDurationInSeconds = this.getEventDurationInSeconds(service);
		return this;
	}

	public detectItem(): void {

		if (this.isEditMode) {
			this.fillForm(this.orderServiceDto);
		}

	}

	public async save(): Promise<void> {

		this.form.updateValueAndValidity();
		this.form.markAllAsTouched();
		this.logger.debug(`Event:save:${this.form.status}`, this.form, this.form.getRawValue());

		if (this.form.valid) {

			this.form.disable();
			this.form.markAsPending();
			const value = this.form.getRawValue() as unknown as IEvent;

			// Delete each configuration of duration at service
			if (value.services?.length) {
				try {
					value.services.map((service) => {
						// delete service.configuration?.duration;
						return {
							...service,
							configuration: {
								...service.configuration,
								duration: undefined,
							},
						};
					});
				} catch (e) {
					this.logger.error(e);
				}
			}

			// Trim note field
			value.note = value.note?.trim();

			// TODO check if customers/attends is exist in db (just check if selected customer has _id field if exist is in db if not then need to make request to create the new customer)

			this.callback?.(this, value);

			this.form.enable();
			this.form.updateValueAndValidity();

		}
	}

	public fillForm(result: IOrderServiceDto | undefined | null): void {
		if (result?._id) {

			// Fill forceStart
			this.forceStart = result.orderAppointmentDetails.start;

			const {orderAppointmentDetails: {attendees}} = result;

			this.form.patchValue({

				_id: result._id,
				services: [{
					...result.serviceSnapshot,
					object: 'Service',
					schedules: [],
					presentation: {
						banners: result.serviceSnapshot.presentation.banners as unknown as RIMedia[],
						color: result.serviceSnapshot.presentation.color,
					} as unknown as IPresentation,
					specialists: result.orderAppointmentDetails.specialists.map((specialist) => {
						return {
							...specialist,
							object: 'SpecialistDto',
						};
					}),
					configuration: result.serviceSnapshot.configuration as unknown as IConfiguration,
				}],
				note: result.customerNote,
				start: result.orderAppointmentDetails.start,
				end: result.orderAppointmentDetails.end,
				timeZone: result.orderAppointmentDetails.timeZone,

			});

			if (attendees?.length) {

				this.form.controls.attendees.removeAt(0);

				attendees.forEach((attendee) => {

					const control = this.form.controls.attendees.pushNewOne(attendee);
					control.disable();

				});

			}

			this.form.updateValueAndValidity();
			this.form.controls.configuration.controls.ignoreEventChecks.patchValue(true);

		}
	}

	public override ngOnDestroy() {
		this.form.destroyHandlers();
		super.ngOnDestroy();
	}

}
