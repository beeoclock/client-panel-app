import {Component, inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {BackLinkComponent} from '@utility/presentation/component/link/back.link.component';
import {ICustomer, validCustomer} from "@customer/domain";
import {TranslateModule} from "@ngx-translate/core";
import {CustomerState} from "@customer/state/customer/customer.state";
import {filter, firstValueFrom, Observable} from "rxjs";
import {Select, Store} from "@ngxs/store";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {HasErrorDirective} from "@utility/presentation/directives/has-error/has-error.directive";
import {InvalidTooltipDirective} from "@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive";
import {CustomerForm} from "@customer/presentation/form";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {InvalidTooltipComponent} from "@utility/presentation/component/invalid-message/invalid-message";
import {BackButtonComponent} from "@utility/presentation/component/button/back.button.component";
import {DefaultPanelComponent} from "@utility/presentation/component/panel/default.panel.component";
import {
	ButtonSaveContainerComponent
} from "@utility/presentation/component/container/button-save/button-save.container.component";
import {KeyValuePipe, NgComponentOutlet, NgForOf} from "@angular/common";
import {
	SwitchActiveBlockComponent
} from "@utility/presentation/component/switch/switch-active/switch-active-block.component";
import {NGXLogger} from "ngx-logger";
import {CustomerActions} from "@customer/state/customer/customer.actions";

@Component({
	selector: 'customer-form-page',
	templateUrl: './index.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		ReactiveFormsModule,
		DeleteButtonComponent,
		HasErrorDirective,
		RouterLink,
		BackLinkComponent,
		InvalidTooltipDirective,
		TranslateModule,
		FormInputComponent,
		SwitchActiveBlockComponent,
		FormTextareaComponent,
		CardComponent,
		PrimaryButtonDirective,
		InvalidTooltipComponent,
		BackButtonComponent,
		DefaultPanelComponent,
		ButtonSaveContainerComponent,
		NgComponentOutlet,
		NgForOf,
		KeyValuePipe,
	],
	standalone: true
})
export default class Index implements OnInit {

	// TODO move functions to store effects/actions

	private readonly store = inject(Store);
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly ngxLogger = inject(NGXLogger);

	@ViewChild(BackButtonComponent)
	public backButtonComponent!: BackButtonComponent;

	public readonly form = new CustomerForm();

	@Select(CustomerState.itemData)
	public itemData$!: Observable<ICustomer | undefined>;
	private isEditMode = false;

	public ngOnInit(): void {
		this.detectItem();
	}

	public detectItem(): void {
		firstValueFrom(this.activatedRoute.params.pipe(filter(({id}) => id?.length))).then(() => {
			firstValueFrom(this.itemData$).then((result) => {
				if (result) {
					this.isEditMode = true;
					this.form.patchValue(result);
					this.form.updateValueAndValidity();
				}
			});
		});
	}

	public async save(): Promise<void> {
		this.form.markAllAsTouched();
		const value = this.form.getRawValue() as ICustomer;
		const validStatus = validCustomer(value);
		if (validStatus.errors.length) {
			this.ngxLogger.error('Object is invalid', validStatus);
			return;
		}
		if (this.form.valid) {
			this.form.disable();
			this.form.markAsPending();
			if (this.isEditMode) {
				await firstValueFrom(this.store.dispatch(new CustomerActions.UpdateItem(value)));
			} else {
				await firstValueFrom(this.store.dispatch(new CustomerActions.CreateItem(value)));
			}
			await this.backButtonComponent.navigateToBack();
			this.form.enable();
			this.form.updateValueAndValidity();

		} else {
			this.ngxLogger.error('Form is invalid', this.form);
		}
	}
}
