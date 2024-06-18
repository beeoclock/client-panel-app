import {Component, Input} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

import {NgIf} from '@angular/common';
import {HasErrorDirective} from '@utility/presentation/directives/has-error/has-error.directive';
import {IsRequiredDirective} from '@utility/presentation/directives/is-required/is-required';
import {InvalidTooltipDirective} from "@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {TranslateModule} from "@ngx-translate/core";
import {CustomerForm} from "@customer/presentation/form";
import {InvalidTooltipComponent} from "@utility/presentation/component/invalid-message/invalid-message";
import {
    NamesFormAttendantComponent
} from "@event/presentation/component/form/attendees/attendant/names.form.attendant.component";

@Component({
    selector: 'app-event-form-attendant-component',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        NgIf,
        HasErrorDirective,
        IsRequiredDirective,
        InvalidTooltipDirective,
        FormInputComponent,
        TranslateModule,
        InvalidTooltipComponent,
        NamesFormAttendantComponent
    ],
    template: `

        <div class="grid gap-4">

            <app-event-names-form-attendant-component [form]="form"/>

            <form-input
                    inputType="email"
                    autocomplete="off"
                    placeholder="firstname.lastname@example.com"
                    id="attendee-email"
                    [control]="form.controls.email"
                    [label]="'keyword.capitalize.email' | translate"/>

            <form-input
                    inputType="tel"
                    autocomplete="off"
                    placeholder="+000000000000"
                    id="attendee-phone"
                    [control]="form.controls.phone"
                    [label]="'keyword.capitalize.phone' | translate"/>

            <div
                    class="md:col-span-2"
                    [class.hidden]="
					form.valid ||
					form.controls.phone.untouched ||
					form.controls.email.untouched
				">
                <utility-invalid-message class="flex justify-center" [control]="form"/>
            </div>

        </div>
    `
})
export class FormAttendantComponent {

    @Input()
    public form!: CustomerForm;


}
