import {Component, inject, input, OnInit, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {ICustomer, validCustomer} from "@tenant/customer/domain";
import {TranslateModule} from "@ngx-translate/core";
import {firstValueFrom} from "rxjs";
import {Store} from "@ngxs/store";
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
import {
	CustomerPresentationActions
} from "@tenant/customer/infrastructure/state/presentation/customer.presentation.actions";

@Component({
	selector: 'balance-form-page',
	templateUrl: './balance-form-container.component.html',
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
	standalone: true
})
export class BalanceFormContainerComponent implements OnInit {

	// TODO move functions to store effects/actions

	private readonly store = inject(Store);
	private readonly ngxLogger = inject(NGXLogger);

	public readonly form = CustomerForm.create({
		customerType: CustomerTypeEnum.regular
	});

	public readonly item = input<ICustomer.DTO | undefined>();

	public readonly isEditMode = input<boolean>(false);

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
			const actions: any[] = [
				new CustomerPresentationActions.CloseForm(),
			]
			if (this.isEditMode()) {
				actions.unshift(new CustomerDataActions.UpdateItem(value));
			} else {
				actions.unshift(new CustomerDataActions.CreateItem(value));
			}
			const action$ = this.store.dispatch(actions);
			await firstValueFrom(action$);
			this.form.enable();
			this.form.updateValueAndValidity();

		} else {
			this.ngxLogger.error('Form is invalid', this.form);
		}
	}
}

export default BalanceFormContainerComponent;
