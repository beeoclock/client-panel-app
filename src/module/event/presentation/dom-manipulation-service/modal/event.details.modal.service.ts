import {inject, Injectable} from '@angular/core';
import {ModalButtonInterface} from "@utility/presentation/component/modal/modal.component";
import {ModalService} from "@utility/presentation/component/modal/modal.service";
import {TranslateService} from "@ngx-translate/core";
import {Reactive} from "@utility/cdk/reactive";
import {ItemEventApiAdapter} from "@event/adapter/external/api/item.event.api.adapter";
import {ContainerDetailsComponent} from "@event/presentation/component/details/container.details.component";

@Injectable({
	providedIn: 'root'
})
export class EventDetailsModalService extends Reactive {

	private readonly modalService = inject(ModalService);
	private readonly translateService = inject(TranslateService);
	private readonly itemEventApiAdapter = inject(ItemEventApiAdapter);

	public async openModal(eventId: string): Promise<void> {

		// const title = await this.translateService.instant('change-name.modal.title');

		// TODO check if event is null

		return new Promise(() => {
			const buttons: ModalButtonInterface[] = [];

			this.modalService.create([{
				component: ContainerDetailsComponent,
				data: {}
			}], {
				buttons,
				fixHeight: false,
				title: '',
				contentPadding: false,
			}).then((modal) => {
				const eventDetailsContainerComponent = modal.instance.componentChildRefList[0];
				return this.itemEventApiAdapter.executeAsync(eventId).then((eventData) => {
					eventDetailsContainerComponent.setInput('event', eventData);
					eventDetailsContainerComponent.setInput('useGrid', false);
					return modal;
				});
			});

		});

	}

}
