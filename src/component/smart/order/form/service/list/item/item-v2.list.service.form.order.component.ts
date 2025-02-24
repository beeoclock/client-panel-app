import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
	OnChanges,
	output,
	SimpleChanges,
	ViewEncapsulation
} from "@angular/core";
import {PrimaryLinkButtonDirective} from "@utility/presentation/directives/button/primary.link.button.directive";
import ObjectID from "bson-objectid";
import {Reactive} from "@utility/cdk/reactive";
import {CustomerChipComponent} from "@src/component/smart/order/form/service/list/item/chip/customer.chip.component";
import {PriceChipComponent} from "@src/component/smart/order/form/service/list/item/chip/price.chip.component";
import {DurationChipComponent} from "@src/component/smart/order/form/service/list/item/chip/duration.chip.component";
import {StartChipComponent} from "@src/component/smart/order/form/service/list/item/chip/start.chip.component";
import LanguageChipComponent from "@src/component/smart/order/form/service/list/item/chip/language.chip.component";
import {ServiceOrderForm} from "@order/presentation/form/service.order.form";
import {ISpecialist} from "@src/core/business-logic/service/interface/i.specialist";
import {NGXLogger} from "ngx-logger";
import {DateTime} from "luxon";
import {ICustomer} from "@src/core/business-logic/customer";
import {SpecialistModel} from "@src/core/business-logic/service/model/specialist.model";
import {StateEnum} from "@core/shared/enum/state.enum";
import {is} from "@src/core/shared/checker";
import {IAttendeeDto} from "@core/business-logic/order/interface/i-order-appointment-details.dto";
import {IService} from "@core/business-logic/service/interface/i.service";
import {IMember} from "@core/business-logic/member/interface/i.member";
import {
	ServiceChipComponent
} from "@src/component/smart/order/form/service/list/item/chip/service/service.chip.component";
import {
	SpecialistChipComponent
} from "@src/component/smart/order/form/service/list/item/chip/specialist.chip.component";
import StatusChipComponent from "@src/component/smart/order/form/service/list/item/chip/status.chip.component";
import {LanguageCodeEnum} from "@core/shared/enum";

@Component({
	selector: 'app-item-list-v2-service-form-order-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		SpecialistChipComponent,
		CustomerChipComponent,
		PriceChipComponent,
		DurationChipComponent,
		StartChipComponent,
		LanguageChipComponent,
		PrimaryLinkButtonDirective,
		ServiceChipComponent,
		StatusChipComponent,
	],
	template: `
		<div class="justify-start items-start gap-1 flex w-full">
			<div class="justify-start gap-1.5 flex flex-1">
				<app-service-chip-component
					[id]="id()"
					(serviceChanges)="handleServiceChanges($event)"
					[initialValue]="service"/>
			</div>
			<button primaryLink (click)="deleteMe.emit()"
					class="w-8 h-8 p-1.5 rounded-lg justify-center items-center flex">
				<i class="bi bi-dash-circle text-2xl"></i>
			</button>
		</div>
		<div class="justify-start items-start flex">
			<div class="justify-start items-start gap-2 flex flex-wrap">
				<app-language-chip-component
					(languageChanges)="handleLanguageChanges($event)"
					[initialValue]="service.languageVersions[0].language"
					[languageVersions]="service.languageVersions"
					[id]="id()"/>
				<app-status-chip-component
					(statusChanges)="handleStatusChanges()"
					[control]="item().control.controls.status"
					[id]="id()"/>
				<app-start-chip-component
					[id]="id()"
					(startChanges)="handleStartChanges($event)"
					[initialValue]="setupPartialData().defaultAppointmentStartDateTimeIso"/>
				<app-duration-chip-component
					[id]="id()"
					(durationChanges)="handleDurationChanges($event)"
					[initialValue]="service.durationVersions[0].durationInSeconds ?? 0"/>
				<app-specialist-chip-component
					[id]="id()"
					(specialistChanges)="handleSpecialistChanges($event)"
					[initialValue]="initialSpecialistOrMember"/>
				<app-price-chip-component
					[id]="id()"
					(priceChanges)="handlePriceChanges($event)"
					[initialValue]="service.durationVersions[0].prices[0].price"
					[currency]="service.durationVersions[0].prices[0].currency"/>
				<app-customer-chip-component
					(customerChanges)="handleCustomerChanges($event)"
					[initialValue]="initialValueForCustomer"
					[id]="id()"/>
			</div>
		</div>

	`,
	host: {
		class: 'flex-col justify-start items-start p-3 gap-2 flex'
	}
})
export class ItemV2ListServiceFormOrderComponent extends Reactive implements OnChanges {

	public readonly item = input.required<{
		service: IService.DTO;
		control: ServiceOrderForm;
	}>();

	public readonly setupPartialData = input<{
		defaultAppointmentStartDateTimeIso?: string;
		defaultMemberForService?: IMember.DTO;
	}>({});

	public readonly id = input<string>(ObjectID().toHexString());

	public readonly deleteMe = output<void>();

	public readonly saveChanges = output<void>();

	readonly #ngxLogger = inject(NGXLogger);

	public ngOnChanges(changes: SimpleChanges) {
		this.#ngxLogger.debug('ItemV2ListServiceFormOrderComponent:ngOnChanges', changes);
	}

	public get initialSpecialistOrMember() {
		const specialist = this.item().control.getRawValue().orderAppointmentDetails.specialists[0];

		if (is.object_not_empty(specialist)) return SpecialistModel.create(specialist);

		const member = this.setupPartialData().defaultMemberForService;

		if (is.object_not_empty(member)) return SpecialistModel.create({member});

		return null;
	}

	public get service() {
		return this.item().service;
	}

	public get initialValueForCustomer() {
		return this.item().control?.controls?.orderAppointmentDetails?.getRawValue?.()?.attendees?.[0]?.customer ?? undefined;
	}

	public handlePriceChanges(price: number) {
		this.#ngxLogger.debug('handlePriceChanges', this.id(), price);
		const {serviceSnapshot} = this.item().control.getRawValue();

		// Check if the price is the same as the previous price, if so, return early
		if (serviceSnapshot.durationVersions[0].prices[0].price === price) return;

		const copyServiceSnapshot = structuredClone(serviceSnapshot);
		copyServiceSnapshot.durationVersions[0].prices[0].price = price;
		this.item().control.controls.serviceSnapshot.patchValue(copyServiceSnapshot);
		this.saveChanges.emit();
	}

	public handleSpecialistChanges(specialist: ISpecialist) {
		this.#ngxLogger.debug('handleSpecialistChanges', this.id(), specialist);
		const {orderAppointmentDetails} = this.item().control.getRawValue();

		const {0: previousSpecialist} = orderAppointmentDetails.specialists;

		if (previousSpecialist && previousSpecialist.member._id === specialist.member._id) return;

		const copyOrderAppointmentDetails = structuredClone(orderAppointmentDetails);
		copyOrderAppointmentDetails.specialists = [specialist];
		this.item().control.controls.orderAppointmentDetails.patchValue(copyOrderAppointmentDetails);
		this.saveChanges.emit();
	}

	public handleServiceChanges(service: IService.DTO) {
		this.#ngxLogger.debug('handleServiceChanges', this.id(), service);
		let {serviceSnapshot} = this.item().control.getRawValue();

		const languageVersions = service.languageVersions.filter(({language}) => {
			return language === serviceSnapshot.languageVersions[0].language;
		});

		if (!languageVersions.length) {
			languageVersions.push(service.languageVersions[0]);
		}

		serviceSnapshot = {
			...serviceSnapshot,
			...service,
			languageVersions,
			durationVersions: serviceSnapshot.durationVersions,
		};

		this.item().control.controls.serviceSnapshot.patchValue(serviceSnapshot);
		this.saveChanges.emit();
	}

	public handleDurationChanges(duration: number) {
		this.#ngxLogger.debug('handleDurationChanges', this.id(), duration);
		const {serviceSnapshot} = this.item().control.getRawValue();
		const {durationInSeconds} = serviceSnapshot.durationVersions[0];

		// Check if the duration is the same as the previous duration, if so, return early
		if (durationInSeconds === duration) return;

		const copyServiceSnapshot = structuredClone(serviceSnapshot);
		copyServiceSnapshot.durationVersions[0].durationInSeconds = duration;
		this.item().control.controls.serviceSnapshot.patchValue(copyServiceSnapshot);

		// Update end of orderAppointmentDetails
		const {orderAppointmentDetails} = this.item().control.getRawValue();
		const copyOrderAppointmentDetails = structuredClone(orderAppointmentDetails);
		copyOrderAppointmentDetails.end = DateTime.fromISO(copyOrderAppointmentDetails.start).plus({seconds: duration}).toJSDate().toISOString();
		this.item().control.controls.orderAppointmentDetails.patchValue(copyOrderAppointmentDetails);
		this.saveChanges.emit();
	}

	public handleLanguageChanges(language: LanguageCodeEnum) {
		this.#ngxLogger.debug('handleLanguageChanges', this.id());
		const {orderAppointmentDetails} = this.item().control.getRawValue();
		orderAppointmentDetails.languageCodes = [language];
		// TODO take service from repository and replace languageVersions
		this.saveChanges.emit();
	}

	public handleStatusChanges() {
		this.#ngxLogger.debug('handleStatusChanges', this.id());
		this.saveChanges.emit();
	}

	public handleStartChanges(start: string) {
		this.#ngxLogger.debug('handleStartChanges', this.id(), start);
		const {orderAppointmentDetails} = this.item().control.getRawValue();

		// Check if the start is the same as the previous start, if so, return early
		if (orderAppointmentDetails.start === start) return;

		const copyOrderAppointmentDetails = structuredClone(orderAppointmentDetails);
		copyOrderAppointmentDetails.start = start;
		copyOrderAppointmentDetails.end = DateTime.fromISO(start).plus({seconds: this.service.durationVersions[0].durationInSeconds}).toJSDate().toISOString();
		this.item().control.controls.orderAppointmentDetails.patchValue(copyOrderAppointmentDetails);
		this.saveChanges.emit();
	}

	public handleCustomerChanges(customer: ICustomer.DTO) {
		this.#ngxLogger.debug('handleCustomerChanges', this.id(), customer);
		const {orderAppointmentDetails} = this.item().control.getRawValue();

		const copyOrderAppointmentDetails = structuredClone(orderAppointmentDetails);
		copyOrderAppointmentDetails.attendees = [
			{
				customer,
				_id: ObjectID().toHexString(),
				createdAt: DateTime.now().toJSDate().toISOString(),
				updatedAt: DateTime.now().toJSDate().toISOString(),
				object: "AttendeeDto",
				state: StateEnum.active,
				stateHistory: [],
			} as unknown as IAttendeeDto
		];
		this.item().control.controls.orderAppointmentDetails.patchValue(copyOrderAppointmentDetails);
		this.saveChanges.emit();
	}

}
