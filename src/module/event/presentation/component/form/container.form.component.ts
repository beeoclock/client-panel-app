import {AfterContentInit, Component, inject, Input, OnInit, QueryList, ViewChildren} from "@angular/core";
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
import {EventState} from "@event/state/event/event.state";
import {combineLatest, filter, firstValueFrom, map, Observable, tap} from "rxjs";
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
	template: `
		<div *ngIf="preview.isOn" class="col-span-12 xl:col-start-3 xl:col-span-8 2xl:col-start-4 2xl:col-span-6">

			<bee-card>
				<event-general-details [isPreview]="preview.isOn" [event]="value"/>
			</bee-card>

			<utility-button-save-container-component>
				<button
					type="button"
					primary
					[isLoading]="form.pending"
					[disabled]="form.disabled"
					[scrollToFirstError]="true"
					(click)="save()">
					{{ 'keyword.capitalize.save' | translate }}
				</button>
			</utility-button-save-container-component>

		</div>


		<div [hidden]="preview.isOn" class="col-span-12 xl:col-start-3 xl:col-span-8 2xl:col-start-4 2xl:col-span-6">

			<form [formGroup]="form" class="flex flex-col gap-4">

				<bee-card>
					<event-attendees-component [form]="form.controls.attendees"/>
				</bee-card>

				<bee-card>
					<event-service-component
						[serviceListControl]="form.controls.services"/>
				</bee-card>

				<bee-card *ngIf="slotsService.specialistExist">
					<event-select-time-slot-form-component
						*ngIf="!forceStart"
						[editable]="!isEditMode"
						[configurationForm]="form.controls.configuration"
						[control]="form.controls.start"/>

					<input
						type="datetime-local"
						*ngIf="forceStart"
						[value]="form.controls.start.value | date: 'yyyy-MM-ddTHH:mm'"
						(change)="updateStartControlByDateTimeString($event)"/>
				</bee-card>

				<bee-card>
					<form-textarea-component
						id="event-form-public-note-input"
						[label]="'keyword.capitalize.note' | translate"
						[placeholder]="'event.form.section.additional.input.note.placeholder' | translate"
						[control]="form.controls.description"/>
				</bee-card>

				<utility-button-save-container-component>
					<button
						type="button"
						primary
						[scrollToFirstError]="true"
						[isLoading]="form.pending"
						[disabled]="form.disabled"
						(click)="goToPreview()">
						{{ 'keyword.capitalize.preview' | translate }}
					</button>
				</utility-button-save-container-component>

			</form>

		</div>
	`
})
export class ContainerFormComponent extends Reactive implements OnInit, AfterContentInit {

	// TODO move functions to store effects/actions

	public isEditMode = false;

	private readonly store = inject(Store);
	public readonly activatedRoute = inject(ActivatedRoute);
	public readonly slotsService = inject(SlotsService);
	public readonly router = inject(Router);
	private readonly logger = inject(NGXLogger);

	public readonly form = new EventForm();

	public readonly preview = new BooleanState(false);

	public specialist = '';
	public eventDurationInSeconds = 0;

	@Input()
	public backButtonComponent!: BackButtonComponent;

	@ViewChildren(ServicesComponent)
	public servicesComponent!: QueryList<ServicesComponent>;

	@Select(EventState.itemData)
	public itemData$!: Observable<RMIEvent | undefined>;

	@Select(ClientState.item)
	public client$!: Observable<RIClient>;

	@Input()
	public forceStart: string | undefined;

	public get value(): RMIEvent {
		return MEvent.create(this.form.getRawValue() as IEvent);
	}

	public readonly callbacksAfterSave = [
		() => {
			this.backButtonComponent.navigateToBack();
		},
	];

	public updateStartControlByDateTimeString(event: Event): void {
		this.logger.debug('updateStartControlByDateTimeString', event);
		const {value} = event.target as HTMLInputElement;
		const date = new Date(value);
		this.form.controls.start.patchValue(date.toISOString());
	}

	constructor() {
		super();
	}

	public ngOnInit(): void {
		this.detectItem();

		const clientAndService$ = combineLatest(
			[
				this.client$.pipe(this.takeUntil(), filter(is.object)),
				this.form.controls.services.valueChanges.pipe(
					this.takeUntil(),
					filter((services) => !!services?.length),
					map(([firstService]) => firstService),
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
			.subscribe(([client, services]) => {
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

		firstValueFrom(this.activatedRoute.params.pipe(filter(({id}) => id?.length))).then(() => {

			firstValueFrom(this.itemData$).then(async (result) => {

				if (result?._id) {

					const {attendees, ...rest} = result;

					const dataFromRoute: {
						cacheLoaded: boolean;
						repeat: boolean;
						item: never; // This is all ngnx store
					} = this.activatedRoute.snapshot.data as never;

					if (dataFromRoute?.repeat) {

						const {status, _id, ...initialValue} = rest;

						this.form.patchValue(structuredClone(initialValue));

					} else {

						this.isEditMode = true;
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

				}

			});

		});

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

			if (this.isEditMode) {

				await firstValueFrom(this.store.dispatch(new EventActions.UpdateItem(value)));

			} else {

				await firstValueFrom(this.store.dispatch(new EventActions.CreateItem(value)));
				await firstValueFrom(this.itemData$);

			}

			this.callbacksAfterSave.forEach((callback) => callback());

			// TODO check if customers/attends is exist in db (just check if selected customer has _id field if exist is in db if not then need to make request to create the new customer)

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

}
