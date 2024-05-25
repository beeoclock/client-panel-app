import {
	AfterContentInit,
	Component,
	inject,
	Input,
	OnChanges,
	OnInit,
	QueryList,
	SimpleChange,
	SimpleChanges,
	ViewChildren
} from "@angular/core";
import {AttendeesComponent} from "@event/presentation/component/form/attendees/attendees.component";
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
import {Select, Store} from "@ngxs/store";
import {ActivatedRoute, Router} from "@angular/router";
import {SlotsService} from "@event/presentation/component/form/select-time-slot/slots.service";
import {NGXLogger} from "ngx-logger";
import {EventForm} from "@event/presentation/form/event.form";
import {BooleanState} from "@utility/domain";
import {BackButtonComponent} from "@utility/presentation/component/button/back.button.component";
import {combineLatest, filter, firstValueFrom, map, Observable, take, tap} from "rxjs";
import {IEvent, MEvent, RMIEvent} from "@event/domain";
import {ClientState} from "@client/state/client/client.state";
import {RIClient} from "@client/domain";
import {is} from "thiis";
import {RISchedule} from "@utility/domain/interface/i.schedule";
import {IService} from "@service/domain";
import {EventActions} from "@event/state/event/event.actions";
import {Reactive} from "@utility/cdk/reactive";
import {TimeInputComponent} from "@utility/presentation/component/input/time.input.component";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {DefaultInputDirective} from "@utility/presentation/directives/input/default.input.directive";
import {DefaultPanelComponent} from "@utility/presentation/component/panel/default.panel.component";
import * as Member from '@member/domain';

@Component({
	selector: 'event-container-form-component',
	standalone: true,
	imports: [
		AttendeesComponent,
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
	],
	providers: [
		SlotsService
	],
	templateUrl: './container.form.component.html'
})
export class ContainerFormComponent extends Reactive implements OnInit, AfterContentInit, OnChanges {

	// TODO move functions to store effects/actions

	@Input()
	public event: RMIEvent | undefined;

	@Input()
	public isEditMode = false;

	@Input()
	public useDefaultFlow = true;

	@Input()
	public backButtonComponent!: BackButtonComponent;

	@Input()
	public forceStart: string | undefined;

	@Input()
	public member: Member.RIMember | undefined;

	@Input()
	public callback: ((component: ContainerFormComponent, formValue: IEvent) => void) | null = null;

	private readonly store = inject(Store);
	public readonly activatedRoute = inject(ActivatedRoute);
	public readonly slotsService = inject(SlotsService);
	public readonly router = inject(Router);
	private readonly logger = inject(NGXLogger);

	public readonly form = new EventForm();

	public readonly preview = new BooleanState(false);

	public specialist = '';
	public eventDurationInSeconds = 0;

	@ViewChildren(ServicesComponent)
	public servicesComponent!: QueryList<ServicesComponent>;

	@Select(ClientState.item)
	public client$!: Observable<RIClient>;

	public get value(): RMIEvent {
		return MEvent.create(this.form.getRawValue() as IEvent);
	}

	public ngOnChanges(changes: SimpleChanges & {forceStart: SimpleChange}): void {
		const {forceStart} = changes;
		if (forceStart && forceStart.currentValue) {
			this.form.controls.start.patchValue(forceStart.currentValue);
		}
	}

	public ngOnInit(): void {

		const clientAndService$ = combineLatest(
			[
				this.client$.pipe(filter(is.object)),
				this.form.controls.services.valueChanges.pipe(
					filter((services) => !!services?.length),
					map(({0: firstService}) => firstService),
					filter((firstService) => {
						// Allow only if specialist or duration is not the same
						const newSpecialist = this.takeSpecialistFromService(firstService);
						const durationInSeconds = this.getEventDurationInSeconds(firstService);
						return this.specialist !== newSpecialist || this.eventDurationInSeconds !== durationInSeconds;
					}),
					tap(this.setSpecialist.bind(this)),
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

		if (this.member) {
			const member = this.member;
			this.form.controls.services.valueChanges.pipe(filter(is.array_not_empty<IService[]>), take(1)).subscribe((services) => {
				this.form.controls.services.patchValue(services.map((service) => {
					return {
						...service,
						specialists: [{
							object: 'SpecialistDto',
							member,
						}],
					};
				}));
			});
		}

		this.detectItem();

	}

	public ngAfterContentInit(): void {

		this.activatedRoute.data.pipe(
			this.takeUntil(),
		).subscribe((data) => {
			// {cacheLoaded: boolean; customer: undefined | ICustomer; service: undefined | IService;}
			const {customer, service} = data;
			if (customer) {
				this.form.controls.attendees.controls[0].controls.customer.patchValue(customer);
				this.form.controls.attendees.controls[0].disable();
			}
			if (service) {
				this.form.controls.services.patchValue([service]);
			}
		});

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

	private takeSpecialistFromService(service: IService): string {

		const [firstSpecialist] = service?.specialists ?? [];

		if (!firstSpecialist) {
			return '';
		}

		const {member} = firstSpecialist;

		if (is.string(member)) {
			return member;
		}

		return member?._id ?? '';

	}

	private setSpecialist(service: IService): this {

		this.specialist = this.takeSpecialistFromService(service);

		return this;

	}

	public detectItem(): void {

		if (this.isEditMode) {

			this.fillForm(this.event);

		}

	}

	public async save(): Promise<void> {

		this.form.updateValueAndValidity();
		this.form.markAllAsTouched();
		this.logger.debug(`Event:save:${this.form.status}`, this.form, this.form.getRawValue());

		if (this.form.valid) {

			this.form.disable();
			this.form.markAsPending();
			const value = this.form.getRawValue() as IEvent;

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

			if (this.useDefaultFlow) {

				if (this.isEditMode) {

					await firstValueFrom(this.store.dispatch(new EventActions.UpdateItem(value)));

				} else {

					await firstValueFrom(this.store.dispatch(new EventActions.CreateItem(value)));

				}

			}

			// TODO check if customers/attends is exist in db (just check if selected customer has _id field if exist is in db if not then need to make request to create the new customer)

			this.callback?.(this, value);

			this.form.enable();
			this.form.updateValueAndValidity();

		}
	}

	public goToPreview(): void {

		if (!this.checkIfServicesAreValid()) {
			this.logger.debug('Services are not valid');
			return;
		}

		this.logger.debug('Services are valid');

		this.form.updateValueAndValidity();
		this.form.markAllAsTouched();
		this.logger.debug(`Event:goToPreview:${this.form.status}`, this.form, this.form.getRawValue());
		if (this.form.valid) {
			this.preview.switchOn();
		}
	}

	private checkIfServicesAreValid(): boolean {
		return this.servicesComponent.toArray().every((serviceComponent) => {
			return serviceComponent.checkValidationOfDurationVersionTypeRangeComponentList();
		});
	}

	public fillForm(result: IEvent | undefined | null): void {
		if (result?._id) {

			const {attendees, ...rest} = result;

			// Fill forceStart
			this.forceStart = rest.start;

			const dataFromRoute: {
				cacheLoaded: boolean;
				repeat: boolean;
				item: never; // This is all ngnx store
			} = this.activatedRoute.snapshot.data as never;

			if (dataFromRoute?.repeat) {

				const {status, _id, ...initialValue} = rest;

				this.form.patchValue(structuredClone(initialValue));

			} else {

				this.form.patchValue(structuredClone(rest));

			}

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

}
