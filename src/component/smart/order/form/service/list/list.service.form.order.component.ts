import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	effect,
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
import {PrimaryLinkButtonDirective} from "@shared/presentation/directives/button/primary.link.button.directive";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ServiceOrderForm, ServiceOrderFormArray} from "@tenant/order/presentation/form/service.order.form";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {ActiveEnum, LanguageCodeEnum} from "@core/shared/enum";
import {ReservationTypeEnum} from "@tenant/order/domain/enum/reservation.type.enum";
import {DateTime} from "luxon";
import {ICustomer} from "@tenant/customer/domain";
import ObjectID from "bson-objectid";
import {IAttendeeDto} from "@tenant/order/domain/interface/i-order-appointment-details.dto";
import {StateEnum} from "@core/shared/enum/state.enum";
import {IService} from "@tenant/service/domain/interface/i.service";
import {IMember} from "@tenant/member/domain/interface/i.member";
import {
	BusinessProfileState
} from "@tenant/business-profile/infrastructure/state/business-profile/business-profile.state";
import {
	ServicePopoverChipComponent
} from "@src/component/smart/order/form/service/list/item/chip/service/service-popover.chip.component";

@Component({
	standalone: true,
	selector: 'app-list-service-form-order-component',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		ItemV2ListServiceFormOrderComponent,
		PrimaryLinkButtonDirective,
		TranslateModule,
		ServicePopoverChipComponent,
	],
	template: `
		<div class="h-12 px-4 py-2 bg-neutral-50 border-slate-400 justify-start items-center gap-2 flex w-full">
			<div class="text-neutral-700 text-base font-bold w-full">
				{{ 'keyword.capitalize.services' | translate }}
			</div>
			<button id="app-list-service-form-order-component-add-service" primaryLink
					class="w-8 rounded-lg justify-center items-center flex !py-0">
				<i class="bi bi-plus-circle text-2xl"></i>
			</button>
			<app-service-popover-chip-component class="absolute" trigger="app-list-service-form-order-component-add-service"
												(result)="addService($event)"/>
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
	`,
	host: {
		class: 'flex-col justify-start items-start flex'
	}
})
export class ListServiceFormOrderComponent implements OnChanges, OnInit {

	public readonly setupPartialData = input<{
		defaultAppointmentStartDateTimeIso?: string;
		defaultMemberForService?: IMember.DTO;
		serviceList?: IService.DTO[];
		customer?: ICustomer.DTO;
	}>({});

	public readonly serviceOrderFormArray = input.required<ServiceOrderFormArray>();

	public readonly selectedServicePlusControlList: {
		service: IService.DTO;
		control: ServiceOrderForm;
		setupPartialData: {
			defaultAppointmentStartDateTimeIso: string;
		};
	}[] = [];

	@SelectSnapshot(BusinessProfileState.baseLanguage)
	public readonly baseLanguage!: LanguageCodeEnum;

	readonly #translateService = inject(TranslateService);
	readonly #changeDetectorRef = inject(ChangeDetectorRef);

	public constructor() {
		effect(() => {
			const setupPartialData = this.setupPartialData();
		});
	}

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

	public async addService($event: IService.DTO) {
		this.addServiceFromServiceList([$event]);
	}

	public addServiceFromServiceList(serviceList: IService.DTO[]) {
		serviceList.forEach((service) => {

			let foundLanguageVersion = service.languageVersions.find(({language}) => language === this.baseLanguage);

			if (!foundLanguageVersion) {
				foundLanguageVersion = service.languageVersions.find(({language}) => language === this.#translateService.currentLang);
			}

			if (!foundLanguageVersion) {
				foundLanguageVersion = service.languageVersions[0];
			}

			let start = this.setupPartialData()?.defaultAppointmentStartDateTimeIso ?? DateTime.now().toJSDate().toISOString();

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
				if (setupPartialData) {

					if (setupPartialData.customer) {
						attendees.push(
							{
								customer: setupPartialData.customer,
								_id: ObjectID().toHexString(),
								createdAt: DateTime.now().toJSDate().toISOString(),
								updatedAt: DateTime.now().toJSDate().toISOString(),
								object: "AttendeeDto",
								state: StateEnum.active,
								stateHistory: [],
							} as unknown as IAttendeeDto
						);
					}
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
