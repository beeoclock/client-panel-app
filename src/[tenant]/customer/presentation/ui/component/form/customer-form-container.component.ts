import {Component, inject, Input, input, OnInit, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {ICustomer, validCustomer} from "@core/business-logic/customer";
import {TranslateModule} from "@ngx-translate/core";
import {firstValueFrom} from "rxjs";
import {Store} from "@ngxs/store";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {CustomerForm} from "@[tenant]/customer/presentation/form";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {InvalidTooltipComponent} from "@utility/presentation/component/invalid-message/invalid-message";
import {
	ButtonSaveContainerComponent
} from "@utility/presentation/component/container/button-save/button-save.container.component";
import {NgComponentOutlet, NgForOf} from "@angular/common";
import {NGXLogger} from "ngx-logger";
import {CustomerTypeEnum} from "@core/business-logic/customer/enum/customer-type.enum";
import {CustomerDataActions} from "@[tenant]/customer/presentation/state/data/customer.data.actions";

@Component({
	selector: 'customer-form-page',
	templateUrl: './customer-form-container.component.html',
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
export class CustomerFormContainerComponent implements OnInit {

	// TODO move functions to store effects/actions

	private readonly store = inject(Store);
	private readonly ngxLogger = inject(NGXLogger);

	public readonly form = CustomerForm.create({
		customerType: CustomerTypeEnum.regular
	});

	public readonly item = input<ICustomer.DTO | undefined>();

	@Input()
	private isEditMode = false;

	public ngOnInit(): void {
		this.detectItem();
	}

	public detectItem(): void {
		const item = this.item();
		if (this.isEditMode && item) {
			this.isEditMode = true;
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
			if (this.isEditMode) {
				await firstValueFrom(this.store.dispatch(new CustomerDataActions.UpdateItem(value)));
			} else {
				await firstValueFrom(this.store.dispatch(new CustomerDataActions.CreateItem(value)));
			}
			this.form.enable();
			this.form.updateValueAndValidity();

		} else {
			this.ngxLogger.error('Form is invalid', this.form);
		}
	}
}
