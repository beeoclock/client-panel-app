import {Component, inject, input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {AbsenceTypeEnum} from "@src/core/business-logic/absence/enums/absence.type.enum";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {SwitchComponent} from "@utility/presentation/component/switch/switch.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {Reactive} from "@utility/cdk/reactive";
import {
	MembersAbsenceFormContainerComponent
} from "@absence/presentation/component/form/members.absence-form-container.component";
import {IAbsence} from "@src/core/business-logic/absence/interface/i.absence";
import {Store} from "@ngxs/store";
import {NGXLogger} from "ngx-logger";
import {firstValueFrom} from "rxjs";
import {AbsenceActions} from "@absence/infrastructure/state/absence/absence.actions";
import {AbsenceForm} from "@absence/presentation/form/absence.form";
import {
	ButtonSaveContainerComponent
} from "@utility/presentation/component/container/button-save/button-save.container.component";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {
	IonDatetime,
	IonDatetimeButton,
	IonLabel,
	IonPopover,
	IonSegment,
	IonSegmentButton
} from "@ionic/angular/standalone";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {DateTime} from "luxon";
import EAbsence from "@core/business-logic/absence/entity/e.absence";

@Component({
	selector: 'app-absence-form-container',
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		FormTextareaComponent,
		CardComponent,
		SwitchComponent,
		NgSelectModule,
		ReactiveFormsModule,
		MembersAbsenceFormContainerComponent,
		ButtonSaveContainerComponent,
		PrimaryButtonDirective,
		IonDatetimeButton,
		IonPopover,
		IonDatetime,
		DefaultLabelDirective,
		IonSegment,
		IonSegmentButton,
		IonLabel,
	],
	standalone: true,
	template: `
		<form class="flex flex-col gap-4">

			<bee-card>

				<ion-segment
					id="absence-form-type-input"
					[formControl]="form.controls.type">

					@for (type of types; track type.id) {

						<ion-segment-button [value]="type.id">
							<ion-label>
								{{ type.label }}
							</ion-label>
						</ion-segment-button>

					}

				</ion-segment>


				<div class="divide-y rounded-xl border">
					<div class="flex justify-between items-center p-2 ps-4">
						<label default for="absence-form-start-input">
							{{ 'keyword.capitalize.start' | translate }}
						</label>
						<div>
							<ion-datetime-button datetime="absence-form-start-input"/>

							<ion-popover [keepContentsMounted]="true">
								<ng-template>
									<ion-datetime [locale]="locale" id="absence-form-start-input"
												  [formControl]="proxyForm.controls.start" [showDefaultButtons]="true"
												  [cancelText]="'keyword.capitalize.cancel' | translate"
												  [doneText]="'keyword.capitalize.done' | translate"></ion-datetime>
								</ng-template>
							</ion-popover>
						</div>
					</div>

					<div class="flex justify-between items-center p-2 ps-4">
						<label default for="absence-form-end-input">
							{{ 'keyword.capitalize.end' | translate }}
						</label>
						<div>
							<ion-datetime-button datetime="absence-form-end-input"/>

							<ion-popover [keepContentsMounted]="true">
								<ng-template>
									<ion-datetime [locale]="locale" id="absence-form-end-input"
												  [formControl]="proxyForm.controls.end" [showDefaultButtons]="true"
												  [cancelText]="'keyword.capitalize.cancel' | translate"
												  [doneText]="'keyword.capitalize.done' | translate"></ion-datetime>
								</ng-template>
							</ion-popover>
						</div>
					</div>
				</div>

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
					[members]="form.controls.members"/>

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
export class AbsenceFormContainerComponent extends Reactive implements OnChanges, OnInit {

	public readonly item = input.required<IAbsence.EntityRaw>();
	public readonly defaultValue = input<Partial<IAbsence.DTO>>({});

	public readonly isEditMode = input<boolean>(false);

	readonly #translateService = inject(TranslateService);

	public get locale(): string {
		return this.#translateService.currentLang;
	}

	public readonly form = AbsenceForm.create(this.defaultValue());
	public readonly proxyForm = AbsenceForm.create(this.defaultValue());

	private readonly store = inject(Store);
	private readonly ngxLogger = inject(NGXLogger);

	public ngOnChanges(changes: SimpleChanges & { item: Partial<IAbsence.DTO> }) {

		const {item} = changes;
		if (item) {
			this.detectItem();
		}

	}

	public ngOnInit() {
		this.proxyForm.controls.start.valueChanges.pipe(
			this.takeUntil(),
		).subscribe({
			next: (value) => {
				this.form.controls.start.patchValue(DateTime.fromISO(value).toJSDate().toISOString());
			}
		});
		this.proxyForm.controls.end.valueChanges.pipe(
			this.takeUntil(),
		).subscribe({
			next: (value) => {
				this.form.controls.end.patchValue(DateTime.fromISO(value).toJSDate().toISOString());
			}
		});
	}

	public detectItem(): void {
		this.form.patchValue(this.item());
		this.form.updateValueAndValidity();
		this.updateProxyForm();
	}

	public async save(): Promise<void> {
		this.form.markAllAsTouched();

		if (this.form.valid) {
			await this.finishSave();
		} else {
			this.ngxLogger.error('Form is invalid', this.form);
		}
	}

	private async finishSave() {
		const value = this.form.getRawValue() as IAbsence.DTO;

		this.form.disable();
		this.form.markAsPending();
		console.log('isEditMode: ', this.isEditMode());
		const entity = EAbsence.fromDTO(value);
		if (this.isEditMode()) {
			await firstValueFrom(this.store.dispatch(new AbsenceActions.UpdateItem(entity)));
		} else {
			await firstValueFrom(this.store.dispatch(new AbsenceActions.CreateItem(entity)));
		}
		this.form.enable();
		this.form.updateValueAndValidity();

	}

	public readonly types = Object.values(AbsenceTypeEnum).map((id) => {
		return {
			id,
			label: this.#translateService.instant(`absence.type.${id}.label`),
		};
	});

	private updateProxyForm() {
		this.proxyForm.patchValue({
			start: DateTime.fromISO(this.form.controls.start.value).toISO() ?? '',
			end: DateTime.fromISO(this.form.controls.end.value).toISO() ?? '',
		});
		this.proxyForm.updateValueAndValidity();
	}
}
