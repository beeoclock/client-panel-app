import {Component, inject, input, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {validCustomer} from "@tenant/customer/domain";
import {TranslateModule} from "@ngx-translate/core";
import {firstValueFrom} from "rxjs";
import {Store} from "@ngxs/store";
import {PrimaryButtonDirective} from "@shared/presentation/directives/button/primary.button.directive";
import {
	ButtonSaveContainerComponent
} from "@shared/presentation/component/container/button-save/button-save.container.component";
import {NGXLogger} from "ngx-logger";
import {
	BalancePresentationActions
} from "@tenant/balance/infrastructure/state/presentation/balance.presentation.actions";
import {BalanceDataActions} from "@tenant/balance/infrastructure/state/data/balance.data.actions";
import {IBalance} from "@tenant/balance/domain";
import {TopUpBalanceForm} from "@tenant/balance/presentation/form";

@Component({
	selector: 'balance-form-page',
	templateUrl: './balance-form-container.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		ReactiveFormsModule,
		TranslateModule,
		PrimaryButtonDirective,
		ButtonSaveContainerComponent,
	],
	standalone: true
})
export class BalanceFormContainerComponent {

	private readonly store = inject(Store);
	private readonly ngxLogger = inject(NGXLogger);

	public readonly form = TopUpBalanceForm.create();

	public readonly item = input<IBalance.DTO | undefined>();

	public async save(): Promise<void> {
		this.form.markAllAsTouched();
		const value = this.form.getRawValue() as any; // TODO DTO interface
		const validStatus = validCustomer(value);
		if (!(validStatus.success) && validStatus.errors.length) {
			this.ngxLogger.error('Object is invalid', validStatus);
			return;
		}
		if (this.form.valid) {
			this.form.disable();
			this.form.markAsPending();
			const actions: any[] = [
				new BalanceDataActions.CreateItem(value),
				new BalancePresentationActions.CloseForm(),
			];
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
