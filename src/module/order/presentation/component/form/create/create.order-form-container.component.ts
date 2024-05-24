import {Component, inject, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Store} from "@ngxs/store";
import {NGXLogger} from "ngx-logger";
import {
	ButtonSaveContainerComponent
} from "@utility/presentation/component/container/button-save/button-save.container.component";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {CreateOrderForm} from "@order/presentation/form/create.order.form";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {OrderFormContainerComponent} from "@order/presentation/component/form/order-form-container.component";

@Component({
	selector: 'app-order-form-create-container',
	template: `
		<form class="flex flex-col gap-4">
			<app-order-form-container/>
			<utility-button-save-container-component class="bottom-0">
				<button
					type="button"
					primary
					[isLoading]="form.pending"
					[disabled]="form.disabled"
					[scrollToFirstError]="true"
					(click)="save()">
					{{ 'keyword.capitalize.save' | translate }}
				</button>
			</utility-button-save-container-component>
		</form>
	`,
	encapsulation: ViewEncapsulation.None,
	imports: [
		OrderFormContainerComponent,
		ButtonSaveContainerComponent,
		PrimaryButtonDirective,
		TranslateModule,
		ReactiveFormsModule,
		OrderFormContainerComponent,
	],
	standalone: true
})
export class CreateOrderFormContainerComponent implements OnInit {

	@Input()
	public item!: Omit<IOrderDto, 'object'>;

	public readonly form: CreateOrderForm = new CreateOrderForm();

	private readonly store = inject(Store);
	private readonly ngxLogger = inject(NGXLogger);

	public ngOnInit(): void {
		this.form.patchValue(this.item);
		this.form.updateValueAndValidity();
	}

	public async save(): Promise<void> {
		this.form.markAllAsTouched();

		this.form.valid && await this.finishSave();
		this.form.invalid && this.ngxLogger.error('Form is invalid', this.form);
	}

	private async finishSave() {
		const value = this.form.getRawValue();

		this.form.disable();
		this.form.markAsPending();
		// await firstValueFrom(this.store.dispatch(new OrderActions.CreateItem(value)));
		this.form.enable();
		this.form.updateValueAndValidity();

	}

}
