import {inject, Injectable} from '@angular/core';
import {ModalButtonInterface} from "@utility/presentation/component/modal/modal.component";
import {ModalService} from "@utility/presentation/component/modal/modal.service";
import {TranslateService} from "@ngx-translate/core";
import {Reactive} from "@utility/cdk/reactive";
import {ItemEventApiAdapter} from "@event/adapter/external/api/item.event.api.adapter";
import {ContainerFormComponent} from "@event/presentation/component/form/container.form.component";
import {NGXLogger} from "ngx-logger";

@Injectable({
	providedIn: 'root'
})
export class EventFormModalService extends Reactive {

	private readonly ngxLogger = inject(NGXLogger);
	private readonly modalService = inject(ModalService);
	private readonly translateService = inject(TranslateService);
	private readonly itemEventApiAdapter = inject(ItemEventApiAdapter);

	public async openModal(data: {
		date: string;
		eventId?: string | undefined;
	}): Promise<void> {

		const {date, eventId} = data;

		this.ngxLogger.debug('Open modal', date, eventId);

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
				eventFormContainerComponentRef.setInput('forceStart', date);
				const eventFormContainerComponent = eventFormContainerComponentRef.instance as ContainerFormComponent;
				eventFormContainerComponent.form.controls.start.setValue(date);
				eventFormContainerComponent.form.controls.configuration.controls.ignoreEventChecks.setValue(true);
				eventFormContainerComponent.callbacksAfterSave[0] = () => {
					modal.instance.closeModal();
				};
				return modal;
			});

		});

	}

}
