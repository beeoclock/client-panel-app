import {ChangeDetectionStrategy, Component, inject, input, output, ViewEncapsulation} from "@angular/core";
import {
	InfiniteScrollCustomEvent,
	IonContent,
	IonInfiniteScroll,
	IonInfiniteScrollContent,
	IonItem,
	IonLabel,
	IonList,
	IonPopover
} from "@ionic/angular/standalone";
import {TranslateModule} from "@ngx-translate/core";
import {IService} from "@tenant/service/domain/interface/i.service";
import {
	ServiceChipPagination
} from "@src/component/smart/order/form/service/list/item/chip/service/service.chip.pagination";
import {AsyncPipe} from "@angular/common";

@Component({
	selector: 'app-service-popover-chip-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		IonItem,
		IonLabel,
		IonList,
		IonPopover,
		TranslateModule,
		AsyncPipe,
		IonContent,
		IonInfiniteScroll,
		IonInfiniteScrollContent,
	],
	providers: [
		ServiceChipPagination
	],
	template: `

		<!-- Control to select specialist -->
		<ion-popover #selectSpecialistPopover [trigger]="trigger()">
			<ng-template>
				<ion-content class="popover-content">
					<ion-list>
						@for (service of (items$ | async); track service._id) {
							<ion-item [button]="true" lines="full" [detail]="false"
									  (click)="result.emit(service);selectSpecialistPopover.dismiss()">
								<div
									class="rounded-full w-4 h-4 me-3 flex items-center"
									[style.background-color]="service.presentation.color">
									{{ service.presentation.color ? '' : '❓' }}
								</div>
								<ion-label>{{ service.languageVersions[0].title }}</ion-label>
							</ion-item>
						}
					</ion-list>
					<ion-infinite-scroll (ionInfinite)="onIonInfinite($event)">
						<ion-infinite-scroll-content/>
					</ion-infinite-scroll>
				</ion-content>
			</ng-template>
		</ion-popover>
	`
})
export class ServicePopoverChipComponent {

	public readonly trigger = input.required<string>();
	public readonly result = output<IService.DTO>();

	private readonly serviceChipPagination = inject(ServiceChipPagination);

	public readonly items$ = this.serviceChipPagination.items$;

	protected onIonInfinite(event: InfiniteScrollCustomEvent) {
		this.serviceChipPagination.fetch().then(() => {
			event.target.complete().then();
		});
	}


}
