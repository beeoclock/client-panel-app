import {inject, Injectable} from '@angular/core';
import {ModalButtonInterface} from "@utility/presentation/component/modal/modal.component";
import {ModalService} from "@utility/presentation/component/modal/modal.service";
import {Reactive} from "@utility/cdk/reactive";
import {ContainerFormComponent} from "@event/presentation/component/form/container.form.component";
import {NGXLogger} from "ngx-logger";
import * as Member from "@member/domain";
import {filter, take} from "rxjs";
import {is} from "thiis";
import {IService} from "@service/domain";
import {ISpecialist} from '@src/module/service/domain/interface/i.specialist';
import {IEvent} from "@event/domain";

@Injectable({
	providedIn: 'root'
})
export class EventFormModalService extends Reactive {

	private readonly ngxLogger = inject(NGXLogger);
	private readonly modalService = inject(ModalService);

	public async openModal(data: {
		datetimeISO: string;
		member?: Member.RIMember | null;
		eventId?: string | undefined;
	}, callback = () => {
	}): Promise<void> {

		const {datetimeISO, eventId, member} = data;

		this.ngxLogger.debug('Open modal', datetimeISO, eventId);

		// const title = await this.translateService.instant('change-name.modal.title');

		// TODO check if event is null

		return new Promise(() => {
			const buttons: ModalButtonInterface[] = [];

			this.modalService.create([{
				component: ContainerFormComponent,
				data: {}
			}], {
				buttons,
				fixHeight: false,
				title: '',
				contentPadding: false,
			}).then((modal) => {
				const eventFormContainerComponentRef = modal.instance.componentChildRefList[0];
				eventFormContainerComponentRef.setInput('forceStart', datetimeISO);
				const eventFormContainerComponent = eventFormContainerComponentRef.instance as ContainerFormComponent;
				eventFormContainerComponent.form.controls.start.patchValue(datetimeISO);
				eventFormContainerComponent.form.controls.configuration.controls.ignoreEventChecks.setValue(true);
				eventFormContainerComponent.callbacksAfterSave[0] = () => {
					callback();
					modal.instance.closeModal();
				};

				if (member) {
					eventFormContainerComponent.form.controls.services.valueChanges.pipe(filter(is.array_not_empty<IService[]>), take(1)).subscribe((services) => {
						eventFormContainerComponent.form.controls.services.patchValue(services.map((service) => {
							return {
								...service,
								specialists: [{
									object: 'Specialist' as ISpecialist['object'],
									member
								}],
							};
						}));
					});
				}

				return modal;
			});

		});

	}

	public async openModalToEdit(data: {
		eventId?: string | undefined;
		event?: IEvent | undefined;
	}): Promise<void> {

		const {eventId, event} = data;

		this.ngxLogger.debug('Open modal to edit', eventId, event);

		return new Promise(() => {
			const buttons: ModalButtonInterface[] = [];

			this.modalService.create([{
				component: ContainerFormComponent,
				data: {}
			}], {
				buttons,
				fixHeight: false,
				title: '',
				contentPadding: false,
			}).then((modal) => {
				const eventFormContainerComponentRef = modal.instance.componentChildRefList[0];
				const eventFormContainerComponent = eventFormContainerComponentRef.instance as ContainerFormComponent;
				eventFormContainerComponent.form.controls.configuration.controls.ignoreEventChecks.setValue(true);
				eventFormContainerComponent.callbacksAfterSave[0] = () => {
					modal.instance.closeModal();
				};

				if (event) {
					eventFormContainerComponent.fillForm(event);
				}

				return modal;
			});

		});

	}

}
