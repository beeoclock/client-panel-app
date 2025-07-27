import {afterNextRender, Component, inject, input, OnInit, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {ICustomer, validCustomer} from "@tenant/customer/domain";
import {TranslateModule} from "@ngx-translate/core";
import {Actions, ofActionErrored, ofActionSuccessful, Store} from "@ngxs/store";
import {CardComponent} from "@shared/presentation/component/card/card.component";
import {CustomerForm} from "@tenant/customer/presentation/form";
import {PrimaryButtonDirective} from "@shared/presentation/directives/button/primary.button.directive";
import {InvalidTooltipComponent} from "@shared/presentation/component/invalid-message/invalid-message";
import {
	ButtonSaveContainerComponent
} from "@shared/presentation/component/container/button-save/button-save.container.component";
import {NgComponentOutlet, NgForOf} from "@angular/common";
import {NGXLogger} from "ngx-logger";
import {CustomerTypeEnum} from "@tenant/customer/domain/enum/customer-type.enum";
import {CustomerDataActions} from "@tenant/customer/infrastructure/state/data/customer.data.actions";
import {CustomerAsyncValidation} from "@tenant/customer/presentation/form/validation/async/customer.async-validation";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {tap} from "rxjs/operators";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
	CustomerPresentationActions
} from "@tenant/customer/infrastructure/state/presentation/customer.presentation.actions";

@Component({
	selector: 'customer-form-page',
	templateUrl: './form.customer.page.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		ReactiveFormsModule,
		TranslateModule,
		CardComponent,
		PrimaryButtonDirective,
		InvalidTooltipComponent,
		ButtonSaveContainerComponent,
		NgComponentOutlet,
		NgForOf,
	],
	providers: [CustomerAsyncValidation],
	standalone: true
})
export class FormCustomerPage implements OnInit {

	private readonly store = inject(Store);
	private readonly actions = inject(Actions);
	private readonly customerAsyncValidation = inject(CustomerAsyncValidation);
	private readonly ngxLogger = inject(NGXLogger);

	public readonly form = CustomerForm.create({
		customerType: CustomerTypeEnum.regular
	});

	public readonly item = input<ICustomer.DTO | undefined>();

	public readonly isEditMode = input<boolean>(false);

	public readonly erroredSubscription = this.actions.pipe(
		takeUntilDestroyed(),
		ofActionErrored(
			CustomerDataActions.UpdateItem,
			CustomerDataActions.CreateItem,
		),
		tap((payload) => {
			this.form.enable();
			this.form.updateValueAndValidity();
		})
	).subscribe();

	public readonly successfulSubscription = this.actions.pipe(
		takeUntilDestroyed(),
		ofActionSuccessful(
			CustomerDataActions.UpdateItem,
			CustomerDataActions.CreateItem,
		),
		tap((payload) => {
			this.ngxLogger.debug('Customer form action successful', payload);
			const action = new CustomerPresentationActions.CloseForm();
			this.store.dispatch(action);
		})
	).subscribe();

	public constructor() {
		afterNextRender(() => {
			this.form.controls.email.addAsyncValidators([
				this.customerAsyncValidation.emailExistAsyncValidator(),
			]);
			this.form.controls.phone.addAsyncValidators([
				this.customerAsyncValidation.phoneExistAsyncValidator(),
			]);
		});
	}

	public ngOnInit(): void {
		this.detectItem();
	}

	public detectItem(): void {
		const item = this.item();
		if (this.isEditMode() && item) {
			this.form.patchValue({
				...item,
				customerType: CustomerTypeEnum.regular
			});
			this.form.updateValueAndValidity();
		}
	}

	public async save(): Promise<void> {
		this.form.markAllAsTouched();
		const value = this.form.getRawValue() as ICustomer.DTO;
		const validStatus = validCustomer(value);
		if (!(validStatus.success) && validStatus.errors.length) {
			this.ngxLogger.error('Object is invalid', validStatus);
			return;
		}
		if (this.form.valid) {

			this.form.disable();
			this.form.markAsPending();

			this.dispatch(value);

		} else {
			this.ngxLogger.error('Form is invalid', this.form);
		}
	}

	@Dispatch()
	public dispatch(value: ICustomer.DTO) {
		if (this.isEditMode()) {
			return new CustomerDataActions.UpdateItem(value);
		} else {
			return new CustomerDataActions.CreateItem(value);
		}
	}
}

export default FormCustomerPage;
