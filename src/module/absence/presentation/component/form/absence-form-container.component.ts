import {Component, inject, Input, OnChanges, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {AbsenceTypeEnum} from "@absence/domain/enums/absence.type.enum";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {DatetimeLocalInputComponent} from "@utility/presentation/component/input/datetime-local.input.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {
	FormBusinessProfileComponent
} from "@client/presentation/component/business-profile/form-business-profile.component";
import {SwitchComponent} from "@utility/presentation/component/switch/switch.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {Reactive} from "@utility/cdk/reactive";
import {NgIf} from "@angular/common";
import {
	MembersAbsenceFormContainerComponent
} from "@absence/presentation/component/form/members.absence-form-container.component";
import {IAbsenceDto} from "@absence/external/interface/i.absence.dto";
import {Store} from "@ngxs/store";
import {NGXLogger} from "ngx-logger";
import {firstValueFrom} from "rxjs";
import {AbsenceActions} from "@absence/state/absence/absence.actions";
import {AbsenceForm} from "@absence/presentation/form/absence.form";
import {
	ButtonSaveContainerComponent
} from "@utility/presentation/component/container/button-save/button-save.container.component";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";

@Component({
	selector: 'app-absence-form-container',
	encapsulation: ViewEncapsulation.None,
	imports: [
		FormInputComponent,
		DatetimeLocalInputComponent,
		TranslateModule,
		FormTextareaComponent,
		CardComponent,
		FormBusinessProfileComponent,
		SwitchComponent,
		NgSelectModule,
		ReactiveFormsModule,
		NgIf,
		MembersAbsenceFormContainerComponent,
		ButtonSaveContainerComponent,
		PrimaryButtonDirective
	],
	standalone: true,
	template: `
		<form class="flex flex-col gap-4">

			<bee-card>

				<ng-select
					id="absence-form-type-input"
					bindLabel="label"
					bindValue="id"
					[formControl]="form.controls.type"
					[items]="types"
					[clearable]="false"/>

				<datetime-local-input-component
					id="absence-form-start-input"
					[label]="'keyword.capitalize.start' | translate"
					[control]="form.controls.start"/>

				<datetime-local-input-component
					id="absence-form-end-input"
					[label]="'keyword.capitalize.end' | translate"
					[control]="form.controls.end"/>

				<form-textarea-component
					id="absence-form-note-input"
					[label]="'keyword.capitalize.note' | translate"
					[placeholder]="'absence.form.inputs.note.placeholder' | translate"
					[control]="form.controls.note"/>

				<utility-switch-component
					id="absence-form-entire-business-switch"
					[booleanValue]="true"
					[control]="form.controls.entireBusiness"
					[label]="'absence.form.inputs.entireBusiness.label' | translate"/>

				<app-members-absence-form-container
					[entireBusiness]="form.controls.entireBusiness"
					[memberIds]="form.controls.memberIds"/>

			</bee-card>
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

	`
})
export class AbsenceFormContainerComponent extends Reactive implements OnChanges {

	@Input()
	public item!: Partial<IAbsenceDto>;

	@Input()
	public isEditMode: boolean = false;

	private readonly translateService = inject(TranslateService);

	public readonly form: AbsenceForm = new AbsenceForm();

	private readonly store = inject(Store);
	private readonly ngxLogger = inject(NGXLogger);

	public ngOnChanges(changes: SimpleChanges & { item: Partial<IAbsenceDto> }) {

		console.log(changes)
		const {item} = changes;
		if (item) {
			this.detectItem();
		}

	}

	public detectItem(): void {
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
		!this.isEditMode && await firstValueFrom(this.store.dispatch(new AbsenceActions.CreateItem(value)));
		this.isEditMode && await firstValueFrom(this.store.dispatch(new AbsenceActions.UpdateItem(value)));
		this.form.enable();
		this.form.updateValueAndValidity();

	}

	public readonly types = Object.values(AbsenceTypeEnum).map((id) => {
		return {
			id,
			label: this.translateService.instant(`absence.type.${id}.label`),
		};
	});
}
