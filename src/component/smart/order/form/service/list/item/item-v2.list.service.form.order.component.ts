import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	HostBinding,
	inject,
	Input,
	OnInit,
	Output,
	ViewEncapsulation
} from "@angular/core";
import {PrimaryLinkButtonDirective} from "@utility/presentation/directives/button/primary.link.button.directive";
import {IServiceDto} from "@order/external/interface/i.service.dto";
import {RIMember} from "@member/domain";
import ObjectID from "bson-objectid";
import {Reactive} from "@utility/cdk/reactive";
import {
	SpecialistChipComponent
} from "@src/component/smart/order/form/service/list/item/chip/specialist.chip.component";
import {CustomerChipComponent} from "@src/component/smart/order/form/service/list/item/chip/customer.chip.component";
import {PriceChipComponent} from "@src/component/smart/order/form/service/list/item/chip/price.chip.component";
import {DurationChipComponent} from "@src/component/smart/order/form/service/list/item/chip/duration.chip.component";
import {StartChipComponent} from "@src/component/smart/order/form/service/list/item/chip/start.chip.component";
import {LanguageChipComponent} from "@src/component/smart/order/form/service/list/item/chip/language.chip.component";
import {ServiceOrderForm} from "@order/presentation/form/service.order.form";
import {ISpecialist} from "@service/domain/interface/i.specialist";
import {NGXLogger} from "ngx-logger";
import {DateTime} from "luxon";
import {ICustomer} from "@customer/domain";
import {ActiveEnum, IsOptionalEnum, IsOrganizerEnum, ResponseStatusEnum} from "@utility/domain/enum";

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
	],
	template: `
		<div class="justify-start items-start gap-1 flex w-full">
			<div class="justify-start items-center gap-1.5 flex flex-1">
				<div
					class="w-3 flex h-[34px] items-center justify-start min-h-full rounded-xl"
					[style.background-color]="service.presentation.color">
					{{ service.presentation.color ? '' : '❓' }}
				</div>
				<div class="justify-start items-center flex">
					<div class="text-black text-sm font-bold">
						{{ service.languageVersions[0]?.title }}
					</div>
				</div>
			</div>
			<button primaryLink (click)="deleteMe.emit()"
					class="w-8 h-8 p-1.5 rounded-lg justify-center items-center flex">
				<i class="bi bi-dash-circle text-2xl"></i>
			</button>
		</div>
		<div class="justify-start items-start flex">
			<div class="justify-start items-start gap-2 flex flex-wrap">
				<app-language-chip-component
					[initialValue]="service.languageVersions[0].language"
					[languageVersions]="service.languageVersions"
					[id]="id"/>
				<app-start-chip-component
					[id]="id"
					(startChanges)="handleStartChanges($event)"
					[initialValue]="setupPartialData.defaultAppointmentStartDateTimeIso"/>
				<app-duration-chip-component
					[id]="id"
					(durationChanges)="handleDurationChanges($event)"
					[initialValue]="service.durationVersions[0].durationInSeconds ?? 0"/>
				<app-specialist-chip-component
					[id]="id"
					(specialistChanges)="handleSpecialistChanges($event)"
					[initialValue]="setupPartialData.defaultMemberForService"/>
				<app-price-chip-component
					[id]="id"
					(priceChanges)="handlePriceChanges($event)"
					[initialValue]="service.durationVersions[0].prices[0].price"
					[currency]="service.durationVersions[0].prices[0].currency"/>
				<app-customer-chip-component
					(customerChanges)="handleCustomerChanges($event)"
					[id]="id"/>
			</div>
		</div>

	`
})
export class ItemV2ListServiceFormOrderComponent extends Reactive implements OnInit {

	@HostBinding()
	public class = 'rounded-2xl shadow border border-gray-200 flex-col justify-start items-start p-3 gap-2 flex';

	@Input()
	public item!: {
		service: IServiceDto;
		control: ServiceOrderForm;
	};

	@Input()
	public setupPartialData: {
		defaultAppointmentStartDateTimeIso?: string;
		defaultMemberForService?: RIMember;
	} = {};

	@Input()
	public readonly id: string = ObjectID().toHexString();

	@Output()
	public readonly deleteMe = new EventEmitter<void>();

	readonly #ngxLogger = inject(NGXLogger);

	public get service() {
		return this.item.service;
	}

	public ngOnInit() {

	}

	public handlePriceChanges(price: number) {
		this.#ngxLogger.debug('handlePriceChanges', price);
		const {serviceSnapshot} = this.item.control.getRawValue();
		const copyServiceSnapshot = structuredClone(serviceSnapshot);
		copyServiceSnapshot.durationVersions[0].prices[0].price = price;
		this.item.control.controls.serviceSnapshot.patchValue(copyServiceSnapshot);
	}

	public handleSpecialistChanges(specialist: ISpecialist) {
		this.#ngxLogger.debug('handleSpecialistChanges', specialist);
		const {orderAppointmentDetails} = this.item.control.getRawValue();

		const copyOrderAppointmentDetails = structuredClone(orderAppointmentDetails);
		copyOrderAppointmentDetails.specialists = [specialist];
		this.item.control.controls.orderAppointmentDetails.patchValue(copyOrderAppointmentDetails);
	}

	public handleDurationChanges(duration: number) {
		this.#ngxLogger.debug('handleDurationChanges', duration);
		const {serviceSnapshot} = this.item.control.getRawValue();
		const copyServiceSnapshot = structuredClone(serviceSnapshot);
		copyServiceSnapshot.durationVersions[0].durationInSeconds = duration;
		this.item.control.controls.serviceSnapshot.patchValue(copyServiceSnapshot);

		// Update end of orderAppointmentDetails
		const {orderAppointmentDetails} = this.item.control.getRawValue();
		const copyOrderAppointmentDetails = structuredClone(orderAppointmentDetails);
		copyOrderAppointmentDetails.end = DateTime.fromISO(copyOrderAppointmentDetails.start).plus({seconds: duration}).toJSDate().toISOString();
		this.item.control.controls.orderAppointmentDetails.patchValue(copyOrderAppointmentDetails);
	}

	public handleStartChanges(start: string) {
		this.#ngxLogger.debug('handleStartChanges', start);
		const {orderAppointmentDetails} = this.item.control.getRawValue();
		const copyOrderAppointmentDetails = structuredClone(orderAppointmentDetails);
		copyOrderAppointmentDetails.start = start;
		copyOrderAppointmentDetails.end = DateTime.fromISO(start).plus({seconds: this.service.durationVersions[0].durationInSeconds}).toJSDate().toISOString();
		this.item.control.controls.orderAppointmentDetails.patchValue(copyOrderAppointmentDetails);
	}

	public handleCustomerChanges(customer: ICustomer) {
		this.#ngxLogger.debug('handleCustomerChanges', customer);
		const {orderAppointmentDetails} = this.item.control.getRawValue();
		const copyOrderAppointmentDetails = structuredClone(orderAppointmentDetails);
		copyOrderAppointmentDetails.attendees = [{
			customer,
			isOptional: IsOptionalEnum.NO,
			isOrganizer: IsOrganizerEnum.NO,
			responseStatus: ResponseStatusEnum.needsAction,
			active: ActiveEnum.YES,
			_id: ObjectID().toHexString(),
			createdAt: DateTime.now().toJSDate().toISOString(),
			updatedAt: DateTime.now().toJSDate().toISOString(),
			object: "Event.Attendant"
		}];
		this.item.control.controls.orderAppointmentDetails.patchValue(copyOrderAppointmentDetails);
	}

}