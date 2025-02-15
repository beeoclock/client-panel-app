import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	HostBinding,
	inject,
	input,
	OnChanges,
	OnInit,
	SimpleChange,
	SimpleChanges,
	ViewEncapsulation
} from "@angular/core";
import {
	ItemV2ListServiceFormOrderComponent
} from "@src/component/smart/order/form/service/list/item/item-v2.list.service.form.order.component";
import {PrimaryLinkButtonDirective} from "@utility/presentation/directives/button/primary.link.button.directive";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {WhacAMoleProvider} from "@utility/presentation/whac-a-mole/whac-a-mole.provider";
import {TableState} from "@utility/domain/table.state";
import {Reactive} from "@utility/cdk/reactive";
import {IServiceDto} from "@src/core/business-logic/order/interface/i.service.dto";
import {RIMember} from "@src/core/business-logic/member";
import {ServiceOrderForm, ServiceOrderFormArray} from "@order/presentation/form/service.order.form";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {ClientState} from "@client/infrastructure/state/client/client.state";
import {ActiveEnum, LanguageCodeEnum} from "@utility/domain/enum";
import {ReservationTypeEnum} from "@src/core/business-logic/order/enum/reservation.type.enum";
import {DateTime} from "luxon";
import {ICustomer} from "@src/core/business-logic/customer";
import ObjectID from "bson-objectid";
import {IAttendeeDto} from "@src/core/business-logic/order/interface/i-order-appointment-details.dto";
import {StateEnum} from "@utility/domain/enum/state.enum";

@Component({
	standalone: true,
	selector: 'app-list-service-form-order-component',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		ItemV2ListServiceFormOrderComponent,
		PrimaryLinkButtonDirective,
		TranslateModule,
	],
	template: `
		<div class="h-12 px-4 py-2 bg-neutral-50 border-slate-400 justify-start items-center gap-2 flex w-full">
			<div class="text-neutral-700 text-base font-bold w-full">
				{{ 'keyword.capitalize.services' | translate }}
			</div>
			<button (click)="addService()" primaryLink class="w-8 rounded-lg justify-center items-center flex !py-0">
				<i class="bi bi-plus-circle text-2xl"></i>
			</button>
		</div>
		<div class="flex-col justify-start items-start flex">
			<div class="bg-white flex-col justify-start items-start flex divide-y border border-gray-200 rounded-2xl">
				@for (item of selectedServicePlusControlList; track item.service._id; let index = $index) {
					<app-item-list-v2-service-form-order-component
						(deleteMe)="deleteItem(index)"
						[item]="item"
						[setupPartialData]="item.setupPartialData"/>
				}
			</div>
		</div>
	`
})
export class ListServiceFormOrderComponent extends Reactive implements OnChanges, OnInit {

	public readonly setupPartialData = input<{
    defaultAppointmentStartDateTimeIso?: string;
    defaultMemberForService?: RIMember;
    serviceList?: IServiceDto[];
    customer?: ICustomer.Entity;
}>({});

	public readonly serviceOrderFormArray = input.required<ServiceOrderFormArray>();

	@HostBinding()
	public class = 'flex-col justify-start items-start flex';

	public readonly selectedServicePlusControlList: {
		service: IServiceDto;
		control: ServiceOrderForm;
		setupPartialData: {
			defaultAppointmentStartDateTimeIso: string;
		};
	}[] = [];

	@SelectSnapshot(ClientState.baseLanguage)
	public readonly baseLanguage!: LanguageCodeEnum;

	readonly #translateService = inject(TranslateService);
	readonly #whacAMaleProvider = inject(WhacAMoleProvider);
	readonly #changeDetectorRef = inject(ChangeDetectorRef);

	public ngOnInit() {
		const setupPartialData = this.setupPartialData();
  if (setupPartialData?.serviceList?.length) {
			this.addServiceFromServiceList(setupPartialData.serviceList);
		}
	}

	public ngOnChanges(changes: SimpleChanges & { serviceOrderFormArray: SimpleChange }) {
		const {serviceOrderFormArray} = changes;
		if (!serviceOrderFormArray) {
			return;
		}
		const {currentValue} = serviceOrderFormArray as { currentValue: ServiceOrderFormArray };
		if (!currentValue) {
			return;
		}
		this.selectedServicePlusControlList.length = 0;
		currentValue.controls.forEach((control) => {
			this.selectedServicePlusControlList.push({
				service: control.getRawValue().serviceSnapshot,
				control,
				setupPartialData: {
					...this.setupPartialData() || {},
					defaultAppointmentStartDateTimeIso: control.getRawValue().orderAppointmentDetails.start,
				}
			});
		});
		this.#changeDetectorRef.detectChanges();
	}

	public deleteItem(index: number) {
		this.selectedServicePlusControlList.splice(index, 1);
		this.serviceOrderFormArray().removeAt(index);
		this.#changeDetectorRef.detectChanges();
	}

	public async addService() {

		const {SelectServiceWhacAMoleComponent} = await import("@service/presentation/push-box/select-service.whac-a-mole.component");

		const useTableStateFromStore = true;
		const tableState = new TableState<IServiceDto>().toCache();

		const pushBoxWrapperComponentRef = await this.#whacAMaleProvider.buildItAsync({
			component: SelectServiceWhacAMoleComponent,
			componentInputs: {
				multiple: false,
				useTableStateFromStore,
				tableState
			}
		});

		if (!pushBoxWrapperComponentRef) {
			return;
		}

		const {renderedComponentRef} = pushBoxWrapperComponentRef.instance;

		if (!renderedComponentRef) {
			return;
		}

		const {instance} = renderedComponentRef;

		if (instance instanceof SelectServiceWhacAMoleComponent) {
			instance.selectedServicesListener.pipe(this.takeUntil()).subscribe(async () => {

				const {newSelectedServiceList} = instance;
				const {0: service} = newSelectedServiceList;
				this.addServiceFromServiceList([service]);

				await this.#whacAMaleProvider.destroyComponent(SelectServiceWhacAMoleComponent);

			});
		}

	}

	public addServiceFromServiceList(serviceList: IServiceDto[]) {
		serviceList.forEach((service) => {

			let foundLanguageVersion = service.languageVersions.find(({language}) => language === this.baseLanguage);

			if (!foundLanguageVersion) {
				foundLanguageVersion = service.languageVersions.find(({language}) => language === this.#translateService.currentLang);
			}

			if (!foundLanguageVersion) {
				foundLanguageVersion = service.languageVersions[0];
			}

			let start = this.setupPartialData().defaultAppointmentStartDateTimeIso ?? DateTime.now().toJSDate().toISOString();

			const attendees: IAttendeeDto[] = [];
			const lastService = this.selectedServicePlusControlList[this.selectedServicePlusControlList.length - 1];

			const setupPartialData = this.setupPartialData();
   if (lastService) {
				const {orderAppointmentDetails} = lastService.control.getRawValue();
				const {attendees: lastServiceAttendees} = orderAppointmentDetails;
				if (lastServiceAttendees.length) {
					attendees.push(lastServiceAttendees[0]);
				}
				start = orderAppointmentDetails.end ?? start;
			} else {
				if (setupPartialData.customer) {
					attendees.push({
						customer: setupPartialData.customer,
						_id: ObjectID().toHexString(),
						createdAt: DateTime.now().toJSDate().toISOString(),
						updatedAt: DateTime.now().toJSDate().toISOString(),
						object: "AttendeeDto",
						state: StateEnum.active,
						stateHistory: []
					});
				}
			}

			const end = DateTime.fromISO(start).plus({seconds: service.durationVersions[0].durationInSeconds}).toJSDate().toISOString();

			this.selectedServicePlusControlList.push({
				service,
				control: this.serviceOrderFormArray().pushNewOne({
					serviceSnapshot: {
						...service,
						durationVersions: [{
							...service.durationVersions[0],
							prices: [service.durationVersions[0].prices[0]]
						}],
						languageVersions: [foundLanguageVersion]
					},
					orderAppointmentDetails: {
						object: "OrderAppointmentDetailsDto",
						active: ActiveEnum.YES,
						start,
						end,
						type: ReservationTypeEnum.service,
						languageCodes: [this.#translateService.currentLang as LanguageCodeEnum],
						specialists: [],
						attendees,
						timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
						createdAt: DateTime.now().toJSDate().toISOString(),
						updatedAt: DateTime.now().toJSDate().toISOString(),
					}
				}),
				setupPartialData: {
					...setupPartialData || {},
					defaultAppointmentStartDateTimeIso: start,
				}
			});

		});

		this.#changeDetectorRef.detectChanges();
	}

}
