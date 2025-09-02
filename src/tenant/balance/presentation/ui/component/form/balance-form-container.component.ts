import {
	afterNextRender,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
	ViewEncapsulation
} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from "@ngx-translate/core";
import {PrimaryButtonDirective} from "@shared/presentation/directives/button/primary.button.directive";
import {
	ButtonSaveContainerComponent
} from "@shared/presentation/ui/component/container/button-save/button-save.container.component";
import {NGXLogger} from "ngx-logger";
import {TopUpBalanceForm} from "@tenant/balance/presentation/form";
import {TOP_UP_BALANCE_PORT} from "@tenant/balance/infrastructure/port/out/top-up.port";
import {PostApi} from "@tenant/balance/infrastructure/data-source/api/post.api";
import {TopUpBalanceUseCase} from "@tenant/balance/application/use-case/top-up-balance.use-case";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
	BalancePresentationActions
} from "@tenant/balance/infrastructure/state/presentation/balance.presentation.actions";
import {CardComponent} from "@shared/presentation/ui/component/card/card.component";
import {FormInputComponent} from "@shared/presentation/ui/component/input/form.input.component";
import {
	BusinessProfileState
} from "@tenant/business-profile/infrastructure/state/business-profile/business-profile.state";
import {Store} from "@ngxs/store";
import {WINDOW} from "@core/cdk/window.provider";
import {TopUpBalanceDtoSchema} from "@tenant/balance/application/dto/top-up-balance.dto";
import {CURRENT_TENANT_ID, TENANT_ID} from "@src/token";

@Component({
	selector: 'balance-form-page',
	templateUrl: './balance-form-container.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		ReactiveFormsModule,
		TranslateModule,
		PrimaryButtonDirective,
		ButtonSaveContainerComponent,
		CardComponent,
		FormInputComponent,
	],
	providers: [
		{
			provide: TOP_UP_BALANCE_PORT,
			useClass: PostApi,
		},
		{
			provide: CURRENT_TENANT_ID,
			useFactory: () => {
				const tenantId = inject(TENANT_ID);
				return tenantId.value;
			},
		},
		TopUpBalanceUseCase,
	],
	standalone: true
})
export class BalanceFormContainerComponent {

	private readonly topUpBalanceUseCase = inject(TopUpBalanceUseCase);
	private readonly currentTenantId = inject(CURRENT_TENANT_ID);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);
	private readonly store = inject(Store);
	private readonly window = inject(WINDOW);
	private readonly baseCurrency = this.store.selectSnapshot(BusinessProfileState.baseCurrency);
	private readonly baseLanguage = this.store.selectSnapshot(BusinessProfileState.baseLanguage);

	private readonly redirectUrl = `${this.window.location.origin}/${this.currentTenantId}/balance/overview`;

	public readonly form = TopUpBalanceForm.create({
		redirectUrl: {
			cancelRedirectUrl: this.redirectUrl,
			successRedirectUrl: this.redirectUrl,
		}
	});

	public constructor() {
		afterNextRender(() => {
			this.form.patchValue({
				currency: this.baseCurrency,
				language: this.baseLanguage,
			})
		})
	}

	public async save(): Promise<void> {
		this.form.markAllAsTouched();
		const value = this.form.getRawValue(); // TODO DTO interface
		if (this.form.valid) {
			this.form.disable();
			this.form.markAsPending();

			try {
				const dto = TopUpBalanceDtoSchema.parse(value);
				const result = await this.topUpBalanceUseCase.execute(dto);
				if (result.url.length) {
					this.window.location.href = result.url;
				}
				this.closeForm();
			} catch (error) {
				this.ngxLogger.error('Error while saving form', error);
			}

			this.form.enable();
			this.form.updateValueAndValidity();
			this.form.markAsDirty();
			this.changeDetectorRef.detectChanges();
		} else {
			this.ngxLogger.error('Form is invalid', this.form);
		}
	}

	@Dispatch()
	public closeForm() {
		return new BalancePresentationActions.CloseForm();
	}

}

export default BalanceFormContainerComponent;
