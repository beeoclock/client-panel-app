import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	HostBinding,
	inject,
	Input,
	OnChanges,
	SimpleChange,
	SimpleChanges,
	ViewEncapsulation
} from "@angular/core";
import {
	ItemV2ListServiceFormOrderComponent
} from "@src/component/smart/order/form/service/list/item/item-v2.list.service.form.order.component";
import {PrimaryLinkButtonDirective} from "@utility/presentation/directives/button/primary.link.button.directive";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NGXLogger} from "ngx-logger";
import {WhacAMoleProvider} from "@utility/presentation/whac-a-mole/whac-a-mole.provider";
import {TableState} from "@utility/domain/table.state";
import {Reactive} from "@utility/cdk/reactive";
import {NgForOf} from "@angular/common";
import {IServiceDto} from "@order/external/interface/i.service.dto";
import {RIMember} from "@member/domain";
import {ServiceOrderForm, ServiceOrderFormArray} from "@order/presentation/form/service.order.form";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {ClientState} from "@client/state/client/client.state";
import {ActiveEnum, LanguageCodeEnum} from "@utility/domain/enum";
import {ReservationTypeEnum} from "@order/domain/enum/reservation.type.enum";
import {DateTime} from "luxon";

@Component({
	standalone: true,
	selector: 'app-list-service-form-order-component',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		ItemV2ListServiceFormOrderComponent,
		PrimaryLinkButtonDirective,
		TranslateModule,
		NgForOf
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
export class ListServiceFormOrderComponent extends Reactive implements OnChanges{

	@Input()
	public setupPartialData: {
		defaultAppointmentStartDateTimeIso?: string;
		defaultMemberForService?: RIMember;
	} = {};

	@Input({required: true})
	public serviceOrderFormArray!: ServiceOrderFormArray;

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

	readonly #ngxLogger = inject(NGXLogger);
	readonly #translateService = inject(TranslateService);
	readonly #whacAMaleProvider = inject(WhacAMoleProvider);
	readonly #changeDetectorRef = inject(ChangeDetectorRef);

	public ngOnChanges(changes: SimpleChanges & {serviceOrderFormArray: SimpleChange}) {
		const {serviceOrderFormArray} = changes;
		if (!serviceOrderFormArray) {
			return;
		}
		const {currentValue} = serviceOrderFormArray as {currentValue: ServiceOrderFormArray};
		if (!currentValue) {
			return;
		}
		this.selectedServicePlusControlList.length = 0;
		currentValue.controls.forEach((control) => {
			this.selectedServicePlusControlList.push({
				service: control.getRawValue().serviceSnapshot,
				control,
				setupPartialData: {
					...this.setupPartialData || {},
					defaultAppointmentStartDateTimeIso: control.getRawValue().orderAppointmentDetails.start,
				}
			});
		});
		this.#changeDetectorRef.detectChanges();
	}

	public deleteItem(index: number) {
		this.selectedServicePlusControlList.splice(index, 1);
		this.serviceOrderFormArray.removeAt(index);
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

				this.#ngxLogger.info('service', service);

				let foundLanguageVersion = service.languageVersions.find(({language}) => language === this.baseLanguage);

				if (!foundLanguageVersion) {
					foundLanguageVersion = service.languageVersions.find(({language}) => language === this.#translateService.currentLang);
				}

				if (!foundLanguageVersion) {
					foundLanguageVersion = service.languageVersions[0];
				}

				let start = this.setupPartialData.defaultAppointmentStartDateTimeIso ?? DateTime.now().toJSDate().toISOString();

				const attendees = [];
				const lastService = this.selectedServicePlusControlList[this.selectedServicePlusControlList.length - 1];

				if (lastService) {
					const {orderAppointmentDetails} = lastService.control.getRawValue();
					const {attendees: lastServiceAttendees} = orderAppointmentDetails;
					if (lastServiceAttendees.length) {
						attendees.push(lastServiceAttendees[0]);
					}
					start = orderAppointmentDetails.end ?? start;
				}

				const end = DateTime.fromISO(start).plus({seconds: service.durationVersions[0].durationInSeconds}).toJSDate().toISOString();

				this.selectedServicePlusControlList.push({
					service,
					control: this.serviceOrderFormArray.pushNewOne({
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
						...this.setupPartialData || {},
						defaultAppointmentStartDateTimeIso: start,
					}
				});

				this.#changeDetectorRef.detectChanges();
				await this.#whacAMaleProvider.destroyComponent(SelectServiceWhacAMoleComponent);

			});
		}

	}

}
