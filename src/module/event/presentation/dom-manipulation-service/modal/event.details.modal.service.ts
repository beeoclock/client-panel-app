import {ComponentRef, inject, Injectable} from '@angular/core';
import {ModalButtonInterface, ModalComponent} from "@utility/presentation/component/modal/modal.component";
import {ModalService} from "@utility/presentation/component/modal/modal.service";
import {Reactive} from "@utility/cdk/reactive";
import {ItemEventApiAdapter} from "@event/adapter/external/api/item.event.api.adapter";
import {ContainerDetailsComponent} from "@event/presentation/component/details/container.details.component";
import {MEvent} from "@event/domain";

@Injectable({
	providedIn: 'root'
})
export class EventDetailsModalService extends Reactive {

	private readonly modalService = inject(ModalService);
	private readonly itemEventApiAdapter = inject(ItemEventApiAdapter);

	public modal: ComponentRef<ModalComponent> | null = null;

	public async openModal(eventId: string): Promise<void> {

		if (this.modal) {
			this.closeModal();
		}

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
				this.modal = modal;
				const eventDetailsContainerComponent = modal.instance.componentChildRefList[0];
				const component = eventDetailsContainerComponent.instance as ContainerDetailsComponent;
				return this.itemEventApiAdapter.executeAsync(eventId).then((eventData) => {
					eventDetailsContainerComponent.setInput('event', MEvent.create(eventData));
					return modal;
				});
			});

		});

	}

	public closeModal(): void {
		this.modal?.instance?.closeModal();
		this.modal = null;
	}

}
