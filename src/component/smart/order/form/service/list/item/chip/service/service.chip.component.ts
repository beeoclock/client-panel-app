import {ChangeDetectionStrategy, Component, inject, input, OnInit, output, ViewEncapsulation} from "@angular/core";
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
import {FormControl} from "@angular/forms";
import ObjectID from "bson-objectid";
import {Reactive} from "@core/cdk/reactive";
import {TranslateModule} from "@ngx-translate/core";
import {IService} from "@tenant/service/domain/interface/i.service";
import {
	ServiceChipPagination
} from "@src/component/smart/order/form/service/list/item/chip/service/service.chip.pagination";
import {AsyncPipe} from "@angular/common";

@Component({
	selector: 'app-service-chip-component',
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
		<button
			[id]="'select-service-' + id()"
			class="ps-0 pe-2 rounded-lg border border-gray-200 justify-center items-center flex gap-1">

			@if (serviceFormControl.value; as service) {

				<div class="block min-h-[32px]">
					<div
						class="h-full rounded-xl w-3 flex items-center min-h-[32px]"
						[style.background-color]="service.presentation.color">
						{{ service.presentation.color ? '' : '❓' }}
					</div>
				</div>
				<div class="justify-start items-center flex py-2">
					<div class="text-black text-sm font-bold text-left">
						{{ service.languageVersions[0]?.title }}
					</div>
				</div>

			} @else {
				<!-- Error: No assigned specialist -->
				<div class="text-red-500 text-sm font-normal px-2 py-1">
					{{ 'order.form.chip.specialist.noAssignedSpecialist' | translate }}
				</div>
			}
		</button>

		<!-- Control to select specialist -->
		<ion-popover #selectSpecialistPopover [trigger]="'select-service-' + id()">
			<ng-template>
				<ion-content class="popover-content">
					<ion-list>
						@for (service of (items$ | async); track service._id) {
							<ion-item [button]="true" lines="full" [detail]="false"
									  (click)="setService(service);selectSpecialistPopover.dismiss()">
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
export class ServiceChipComponent extends Reactive implements OnInit {

	public readonly initialValue = input<IService.DTO | null>(null);

	public readonly id = input<string>(ObjectID().toHexString());

	private readonly serviceChipPagination = inject(ServiceChipPagination);

	public readonly serviceChanges = output<IService.DTO>();

	public readonly serviceFormControl = new FormControl<IService.DTO | null>(null);

	public readonly items$ = this.serviceChipPagination.items$;

	public ngOnInit() {
		this.initService();
	}

	public initService() {
		const initialValue = this.initialValue();
		this.serviceFormControl.setValue(initialValue);
	}

	public setService(service: IService.DTO | null) {
		if (!service) {
			return;
		}
		if (service._id !== this.serviceFormControl.getRawValue()?._id) {
			this.serviceFormControl.setValue(service);
			this.serviceChanges.emit(service);
		}
	}

	protected onIonInfinite(event: InfiniteScrollCustomEvent) {
		this.serviceChipPagination.fetch().then(() => {
			event.target.complete().then();
		});
	}


}
