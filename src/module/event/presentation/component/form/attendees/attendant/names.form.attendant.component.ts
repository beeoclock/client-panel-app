import {Component, HostBinding, Input, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

import {NgIf} from '@angular/common';
import {HasErrorDirective} from '@utility/presentation/directives/has-error/has-error.directive';
import {IsRequiredDirective} from '@utility/presentation/directives/is-required/is-required';
import {InvalidTooltipDirective} from "@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {TranslateModule} from "@ngx-translate/core";
import {CustomerForm} from "@customer/presentation/form";
import {InvalidTooltipComponent} from "@utility/presentation/component/invalid-message/invalid-message";

@Component({
    selector: 'app-event-names-form-attendant-component',
    standalone: true,
	encapsulation: ViewEncapsulation.None,
    imports: [
        ReactiveFormsModule,
        NgIf,
        HasErrorDirective,
        IsRequiredDirective,
        InvalidTooltipDirective,
        FormInputComponent,
        TranslateModule,
        InvalidTooltipComponent
    ],
    template: `

        <form-input
            inputType="text"
            autocomplete="off"
            id="attendee-first-name"
            [placeholder]="'keyword.capitalize.firstName' | translate"
            [control]="form.controls.firstName"
            [label]="'keyword.capitalize.firstName' | translate"/>

        <form-input
            inputType="text"
            autocomplete="off"
            id="attendee-last-name"
            [placeholder]="'keyword.capitalize.lastName' | translate"
            [control]="form.controls.lastName"
            [label]="'keyword.capitalize.lastName' | translate"/>


    `
})
export class NamesFormAttendantComponent {

    @Input()
    public form!: CustomerForm;

    @HostBinding()
    public readonly class = 'flex gap-3';


}
