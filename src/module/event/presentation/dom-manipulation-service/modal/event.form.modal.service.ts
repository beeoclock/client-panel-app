import {inject, Injectable} from '@angular/core';
import {ModalButtonInterface} from "@utility/presentation/component/modal/modal.component";
import {ModalService} from "@utility/presentation/component/modal/modal.service";
import {TranslateService} from "@ngx-translate/core";
import {Reactive} from "@utility/cdk/reactive";
import {ItemEventApiAdapter} from "@event/adapter/external/api/item.event.api.adapter";
import {ContainerFormComponent} from "@event/presentation/component/form/container.form.component";
import {NGXLogger} from "ngx-logger";
import * as Member from "@member/domain";
import {filter, take} from "rxjs";
import {is} from "thiis";
import {IService} from "@service/domain";

@Injectable({
	providedIn: 'root'
})
export class EventFormModalService extends Reactive {

	private readonly ngxLogger = inject(NGXLogger);
	private readonly modalService = inject(ModalService);
	private readonly translateService = inject(TranslateService);
	private readonly itemEventApiAdapter = inject(ItemEventApiAdapter);

	public async openModal(data: {
		datetimeISO: string;
		member?: Member.RIMember | null;
		eventId?: string | undefined;
	}, callback = () => {}): Promise<void> {

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
								specialists: service.specialists.map((specialist) => {
									return {
										...specialist,
										member
									}
								}),
							};
						}));
					});
				}

				return modal;
			});

		});

	}

}
