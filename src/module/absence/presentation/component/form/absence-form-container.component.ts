import {Component, inject, Input, ViewEncapsulation} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {AbsenceTypeEnum} from "@absence/domain/enums/absence.type.enum";
import {ActiveEnum} from "@utility/domain/enum";
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
        MembersAbsenceFormContainerComponent
    ],
    standalone: true,
    template: `

        <bee-card>

            <ng-select
                    id="absence-form-type-input"
                    bindLabel="label"
                    bindValue="id"
                    [formControl]="type"
                    [items]="types"
                    [clearable]="false"/>

            <datetime-local-input-component
                    id="absence-form-start-input"
                    [label]="'keyword.capitalize.start' | translate"
                    [control]="start"/>

            <datetime-local-input-component
                    id="absence-form-end-input"
                    [label]="'keyword.capitalize.end' | translate"
                    [control]="end"/>

            <form-textarea-component
                    id="absence-form-note-input"
                    [label]="'keyword.capitalize.note' | translate"
                    [placeholder]="'absence.form.inputs.note.placeholder' | translate"
                    [control]="note"/>

            <utility-switch-component
                    id="absence-form-entire-business-switch"
                    [units]="[false, true]"
                    [control]="entireBusiness"
                    [label]="'absence.form.inputs.entireBusiness.label' | translate"/>

            <app-members-absence-form-container
                    [entireBusiness]="entireBusiness"
                    [memberIds]="memberIds"/>

        </bee-card>

    `
})
export class AbsenceFormContainerComponent extends Reactive {

    @Input()
    public start!: FormControl<string>;

    @Input()
    public end!: FormControl<string>;

    @Input()
    public timeZone!: FormControl<string>;

    @Input()
    public note!: FormControl<string>;

    @Input()
    public active!: FormControl<ActiveEnum>;

    @Input()
    public type!: FormControl<AbsenceTypeEnum>;

    @Input()
    public entireBusiness!: FormControl<boolean>;

    @Input()
    public memberIds!: FormControl<string[]>;

    private readonly translateService = inject(TranslateService);

    public readonly types = Object.values(AbsenceTypeEnum).map((id) => {
        return {
            id,
            label: this.translateService.instant(`absence.type.${id}.label`),
        };
    });
}
