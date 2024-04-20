import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

import {NgIf} from '@angular/common';
import {HasErrorDirective} from '@utility/presentation/directives/has-error/has-error.directive';
import {IsRequiredDirective} from '@utility/presentation/directives/is-required/is-required';
import {InvalidTooltipDirective} from "@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {TranslateModule} from "@ngx-translate/core";
import {CustomerForm} from "@customer/presentation/form";
import {InvalidTooltipComponent} from "@utility/presentation/component/invalid-message/invalid-message";
import {ICustomer} from "@customer/domain";

@Component({
	selector: 'event-attendant-component',
	standalone: true,
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

		<div class="flex justify-between items-center pb-2">
			<span class="text-beeColor-400">{{ 'keyword.capitalize.customer' | translate }} #{{ index + 1 }}</span>

			<button
				*ngIf="enableRemove"
				(click)="removeEmitter.emit()"
				type="button"
				class="text-beeColor-600 hover:text-red-600 hover:bg-red-100 px-2 py-1 rounded-2xl">
				<i class="bi bi-trash"></i>
			</button>
		</div>

		<ng-container *ngIf="form.disabled; else FromTemplate">

			<div class="rounded-md border border-gray-200 grid grid-cols-1 py-4 pl-4 pr-5 text-sm leading-6">
				<div>{{ customer.firstName }} {{ customer.lastName }} </div>
				<div>{{ customer.email }}</div>
				<div>{{ customer.phone }}</div>
			</div>

		</ng-container>

		<ng-template #FromTemplate>
			<div class="grid md:grid-cols-2 gap-4">

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
		</ng-template>
	`
})
export class AttendantComponent {

	@Input()
	public form!: CustomerForm;

	@Input()
	public index = 0;

	@Input()
	public enableRemove = false;

	@Output()
	public readonly removeEmitter = new EventEmitter<number>();

	public get customer(): ICustomer {
		return this.form.value as ICustomer;
	}

}
