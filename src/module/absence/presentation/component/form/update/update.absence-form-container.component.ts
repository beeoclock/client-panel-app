import {Component, inject, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {firstValueFrom} from "rxjs";
import {Store} from "@ngxs/store";
import {NGXLogger} from "ngx-logger";
import {IAbsenceDto} from "@absence/external/interface/i.absence.dto";
import {AbsenceActions} from "@absence/state/absence/absence.actions";
import {UpdateAbsenceForm} from "@absence/presentation/form/update.absence.form";
import {AbsenceFormContainerComponent} from "@absence/presentation/component/form/absence-form-container.component";
import {
	ButtonSaveContainerComponent
} from "@utility/presentation/component/container/button-save/button-save.container.component";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
	selector: 'app-absence-form-update-container',
	template: `
		<form class="flex flex-col gap-4">
			<app-absence-form-container
				[timeZone]="form.controls.timeZone"
				[note]="form.controls.note"
				[active]="form.controls.active"
				[type]="form.controls.type"
				[entireBusiness]="form.controls.entireBusiness"
				[memberIds]="form.controls.memberIds"
				[end]="form.controls.end"
				[start]="form.controls.start"/>
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
		AbsenceFormContainerComponent,
		ButtonSaveContainerComponent,
		PrimaryButtonDirective,
		TranslateModule,
		ReactiveFormsModule,
	],
	standalone: true
})
export class UpdateAbsenceFormContainerComponent implements OnInit {

	@Input()
	public item!: Omit<IAbsenceDto, 'object'>;

	public readonly form: UpdateAbsenceForm = new UpdateAbsenceForm();

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
		await firstValueFrom(this.store.dispatch(new AbsenceActions.UpdateItem(value)));
		this.form.enable();
		this.form.updateValueAndValidity();

	}
}
