import {
	afterNextRender,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	computed,
	DestroyRef,
	effect,
	inject,
	input,
	signal,
	ViewEncapsulation
} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {FormTextareaComponent} from "@shared/presentation/component/input/form.textarea.component";
import {CardComponent} from "@shared/presentation/component/card/card.component";
import {
	ButtonSaveContainerComponent
} from "@shared/presentation/component/container/button-save/button-save.container.component";
import {PrimaryButtonDirective} from "@shared/presentation/directives/button/primary.button.directive";
import {Store} from "@ngxs/store";
import {NGXLogger} from "ngx-logger";
import {OrderActions} from "@tenant/order/order/infrastructure/state/order/order.actions";
import {ICustomer} from "@tenant/customer/domain";
import {
	ListServiceFormOrderComponent
} from "@shared/presentation/component/smart/order/form/service/list/list.service.form.order.component";
import {FormsModule} from "@angular/forms";
import {firstValueFrom, lastValueFrom} from "rxjs";
import {
	CalendarWithSpecialistsAction
} from "@tenant/event/infrastructure/state/calendar-with-specialists/calendar-with-specialists.action";
import {IService} from "@tenant/service/domain/interface/i.service";
import {IOrder} from "@tenant/order/order/domain/interface/i.order";
import {IMember} from "@tenant/member/member/domain/interface/i.member";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import EOrder from "@tenant/order/order/domain/entity/e.order";
import {OrderForm} from "@tenant/order/order/presentation/form/order.form";

@Component({
	selector: 'order-form-page',
	encapsulation: ViewEncapsulation.None,
	imports: [
		ListServiceFormOrderComponent,
		ButtonSaveContainerComponent,
		PrimaryButtonDirective,
		TranslateModule,
		CardComponent,
		FormTextareaComponent,
		FormsModule,
	],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form class="flex flex-col gap-4 bg-white">

			<app-list-service-form-order-component
				#appListServiceFormOrderComponent
				[serviceOrderFormArray]="form.controls.services"
				[setupPartialData]="setupPartialData()"
				class="flex-1"/>

			<bee-card>
				<form-textarea-component
					id="order-business-note"
					[label]="'keyword.capitalize.businessNote' | translate"
					[placeholder]="'order.form.input.businessNote.placeholder' | translate"
					[control]="form.controls.businessNote"/>
			</bee-card>

			<utility-button-save-container-component class="bottom-0">
				<button
					type="button"
					primary
					[isLoading]="form.pending"
					[isDisabled]="form.disabled || (!appListServiceFormOrderComponent.serviceOrderFormArray().length)"
					[scrollToFirstError]="true"
					(click)="save()">
					{{ 'keyword.capitalize.save' | translate }}
				</button>
			</utility-button-save-container-component>
		</form>
	`
})
export class OrderFormPage {

	public readonly order = input<EOrder | null>(null);

	public readonly customerJSON = input(null, {
		transform: (value: string) => {
			if (value) {
				return JSON.parse(value) as ICustomer.DTO;
			}
			return null;
		}
	});
	public readonly memberJSON = input(null, {
		transform: (value: string) => {
			if (value) {
				return JSON.parse(value) as IMember.DTO;
			}
			return null;
		}
	});
	public readonly serviceListJSON = input([] as IService.DTO[], {
		transform: (value: string) => {
			if (value) {
				return JSON.parse(value) as IService.DTO[];
			}
			return null;
		}
	});
	public readonly appointmentStartDateTimeIso = input<string | null>(null);

	/**
	 *
	 * 		defaultAppointmentStartDateTimeIso?: string;
	 * 		defaultMemberForService?: IMember.EntityRaw;
	 * 		serviceList?: IService.DTO[];
	 * 		customer?: ICustomer.EntityRaw;
	 */
	public readonly setupPartialData = computed(() => {

		const {customerJSON, memberJSON, serviceListJSON, appointmentStartDateTimeIso} = this;

		const result: any = {};

		if (customerJSON()) {
			result.customer = customerJSON();
		}

		if (memberJSON()) {
			result.defaultMemberForService = memberJSON();
		}

		if (serviceListJSON()?.length) {
			result.serviceList = serviceListJSON();
		}

		if (appointmentStartDateTimeIso()) {
			result.defaultAppointmentStartDateTimeIso = appointmentStartDateTimeIso();
		}

		return result;

	});

	public readonly isEditMode = input<boolean>(false);
	public readonly firstStepOnInit = input<{
		openServiceForm: boolean;
		serviceFormWasOpened: boolean;
	}>({
		openServiceForm: true,
		serviceFormWasOpened: false
	});

	private readonly store = inject(Store);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly destroyRef = inject(DestroyRef);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	public readonly availableCustomersInForm = signal<{ [key: string]: ICustomer.DTO }>({});

	public readonly form: OrderForm = OrderForm.create();

	public constructor() {
		effect(() => {

			const order = this.order();

			if (order) this.patchOrderValue(order);

			this.form.updateValueAndValidity();

			this.form.updateValueAndValidity();

		});

		afterNextRender({
			read: () => {
				this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
					value.services?.forEach((service) => {
						service.orderAppointmentDetails?.attendees.forEach((attendee) => {
							this.availableCustomersInForm.set({
								[attendee.customer._id]: attendee.customer,
								...this.availableCustomersInForm()
							})
						});
					});
				});
			}
		})
	}

	public async save(): Promise<void> {
		this.form.markAllAsTouched();
		if (this.form.invalid) {
			this.ngxLogger.error('Form is invalid', this.form)
			return;
		}
		await this.finishSave();
	}

	/**
	 * Dispatch put order action
	 * @param item
	 * @private
	 */
	private dispatchPutOrderAction$(item: IOrder.DTO) {
		const action = new OrderActions.UpdateItem(item);
		return this.store.dispatch(action);
	}

	private async finishSave() {
		const formValue = this.form.getRawValue();
		this.form.disable();
		this.form.markAsPending();
		const entity = EOrder.fromFormValue(formValue);

		try {

			if (this.isEditMode()) {

				await lastValueFrom(this.dispatchPutOrderAction$(entity));

			} else {

				const createOrder$ = this.store.dispatch(new OrderActions.CreateItem(entity));
				await firstValueFrom(createOrder$);

				const actions$ = this.store.dispatch([
					new CalendarWithSpecialistsAction.GetItems(),
				]);

				await firstValueFrom(actions$);

			}

			this.store.dispatch(new OrderActions.CloseForm());

		} catch (error) {

			this.ngxLogger.error('Error while creating order', error);

		}

		this.form.enable();
		this.form.updateValueAndValidity();
	}

	private patchOrderValue(order: EOrder) {
		this.form.patchValue(order);
		order.services?.forEach((service) => {
			this.form.controls.services.pushNewOne(service);
		});
		this.changeDetectorRef.detectChanges();
	}

}

export default OrderFormPage;
