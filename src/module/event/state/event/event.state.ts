import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {EventActions} from "@event/state/event/event.actions";
import {TranslateService} from "@ngx-translate/core";
import {IOrderState} from "@order/state/order/order.state";
import {
	PatchStatusServiceOrderApiAdapter
} from "@order/external/adapter/api/status/patch.status.service.order.api.adapter";
import {WhacAMoleProvider} from "@utility/presentation/whac-a-mole/whac-a-mole.provider";
import {NGXLogger} from "ngx-logger";
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";
import {ContainerFormComponent} from "@event/presentation/component/form/container.form.component";
import {IAttendee_V2, IEvent} from "@event/domain";
import {ServiceOrderForm} from "@order/presentation/form/service.order.form";
import {ActiveEnum, IsOrganizerEnum} from "@utility/domain/enum";
import {ReservationTypeEnum} from "@order/domain/enum/reservation.type.enum";
import {IServiceDto} from "@order/external/interface/i.service.dto";
import {UpdateServiceOrderApiAdapter} from "@order/external/adapter/api/update.service.order.api.adapter";


export interface IEventState {

}

@State<IEventState>({
	name: 'event',
	defaults: {},
})
@Injectable()
export class EventState {

	private readonly patchStatusServiceOrderApiAdapter = inject(PatchStatusServiceOrderApiAdapter);

	// Change status
	private readonly translateService = inject(TranslateService);
	private readonly whacAMaleProvider = inject(WhacAMoleProvider);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly updateServiceOrderApiAdapter = inject(UpdateServiceOrderApiAdapter);

	// Application layer

	@Action(EventActions.UpdateOpenedDetails)
	public async updateOpenedDetails(ctx: StateContext<IEventState>, {payload: item}: EventActions.UpdateOpenedDetails) {

		const {ContainerDetailsComponent} = await import("@event/presentation/component/details/container.details.component");

		this.ngxLogger.debug('EventState.updateOpenedDetails', item);
		await this.whacAMaleProvider.updateWhacAMoleComponentAsync({
			component: ContainerDetailsComponent,
			componentInputs: {
				event: structuredClone(item)
			},
		}).catch((error) => {
			this.ngxLogger.error('EventState.updateOpenedDetails', error);
		});

	}

	@Action(EventActions.CloseDetails)
	public async closeDetails() {

		const {ContainerDetailsComponent} = await import("@event/presentation/component/details/container.details.component");

		await this.whacAMaleProvider.destroyComponent(ContainerDetailsComponent);

	}

	@Action(EventActions.OpenDetails)
	public async openDetails(ctx: StateContext<IEventState>, {payload: item}: EventActions.OpenDetails) {

		const title = this.translateService.instant('event.details.title');

		const {ContainerDetailsComponent} = await import("@event/presentation/component/details/container.details.component");

		await this.whacAMaleProvider.buildItAsync({
			title,
			component: ContainerDetailsComponent,
			componentInputs: {
				event: item
			},
		});

	}

	// @Action(EventActions.OpenDetailsById)
	// public async openDetailsById(ctx: StateContext<IEventState>, {payload: id}: EventActions.OpenDetailsById) {
	//
	// 	const title = this.translateService.instant('event.details.title');
	//
	// 	const {ContainerDetailsComponent} = await import("@event/presentation/component/details/container.details.component");
	//
	// 	await this.whacAMaleProvider.buildItAsync({
	// 		component: ContainerDetailsComponent,
	// 		showLoading: true,
	// 		title
	// 	});
	//
	// 	const event = await this.item.executeAsync(id);
	//
	// 	await this.whacAMaleProvider.updateWhacAMoleComponentAsync({
	// 		id,
	// 		component: ContainerDetailsComponent,
	// 		componentInputs: {
	// 			event: Event.MEvent.create(event)
	// 		},
	// 	});
	//
	// }

	@Action(EventActions.OpenOrderServiceForm)
	public async openOrderServiceFormAction(ctx: StateContext<IOrderState>, {payload}: EventActions.OpenOrderServiceForm): Promise<void> {


		this.ngxLogger.info('openOrderServiceFormAction', payload);

		const {isEditMode, event} = payload;

		const {service} = event.originalData;

		const componentInputs: {
			orderServiceDto: Partial<IOrderServiceDto>;
			useDefaultFlow: boolean;
			isEditMode: boolean;
			forceStart?: string;
		} = {
			isEditMode: isEditMode ?? false,
			useDefaultFlow: false,
			orderServiceDto: service ?? {},
		};

		const componentRef = await this.whacAMaleProvider.buildItAsync({
			title: this.translateService.instant('event.form.title.edit'),
			component: ContainerFormComponent,
			componentInputs,
		});

		if (!componentRef) {
			return;
		}

		const {renderedComponentRef} = componentRef.instance;

		if (!renderedComponentRef) {
			return;
		}

		renderedComponentRef.setInput('callback', async (component: ContainerFormComponent, formValue: IEvent) => {
			this.ngxLogger.info('callback', component, formValue);

			if (!formValue.services || !formValue.services.length) {
				return;
			}

			if (!formValue.attendees || !formValue.attendees.length) {
				return;
			}

			if (!formValue.timeZone) {
				return;
			}

			if (!formValue.start) {
				return;
			}

			if (!formValue.end) {
				return;
			}

			const orderServiceForm = ServiceOrderForm.create({
				...(formValue as any),
				customerNote: formValue.note,
				orderAppointmentDetails: {
					object: 'OrderAppointmentDetailsDto',
					active: ActiveEnum.YES,
					start: formValue.start,
					end: formValue.end,
					type: ReservationTypeEnum.service,
					// languageCodes: LanguageCodeEnum[];
					// attachments: IAttachmentDto[];
					specialists: formValue.services[0].specialists,
					attendees: formValue.attendees,
					// locations: ILocationsDto[];
					timeZone: formValue.timeZone,
					createdAt: formValue.createdAt,
					updatedAt: formValue.updatedAt,
				},
				serviceSnapshot: {
					...formValue.services[0],
					object: "ServiceDto",
				} as unknown as IServiceDto,
			});

			const orderServiceFormValue = orderServiceForm.value;
			const response = await this.updateServiceOrderApiAdapter.executeAsync(event.originalData.order._id, orderServiceFormValue);

			const attendees = response.orderAppointmentDetails?.specialists.map((specialist) => {
				return {
					_id: specialist.member._id,
					isOrganizer: IsOrganizerEnum.NO,
					is: 'specialist',
					originalData: specialist,
				} as IAttendee_V2;
			});

			response.orderAppointmentDetails?.attendees.forEach((attendee) => {
				attendees.push({
					_id: attendee._id,
					isOrganizer: IsOrganizerEnum.NO,
					is: 'customer',
					originalData: attendee,
				} as IAttendee_V2);
			});

			// TODO: call function to increase defaultAppointmentStartDateTimeIso
			ctx.dispatch(new EventActions.UpdateOpenedDetails({
				...event,
				originalData: {
					...event.originalData,
					service: response
				},
				start: formValue.start,
				end: formValue.end,
				_id: event._id,

				note: formValue.note ?? '',
				attendees,
				updatedAt: formValue.updatedAt,
			}));

			componentRef.instance.destroySelf();

		});

	}

	@Action(EventActions.ChangeServiceStatus)
	public async changeStatusActionHandler(ctx: StateContext<IOrderState>, action: EventActions.ChangeServiceStatus): Promise<void> {
		await this.patchStatusServiceOrderApiAdapter.executeAsync(
			action.payload.orderId,
			action.payload.serviceId,
			action.payload.status
		);

	}

}
