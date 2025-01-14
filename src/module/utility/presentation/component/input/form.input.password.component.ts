import {Component, input, ViewEncapsulation} from "@angular/core";
import {IsRequiredDirective} from "@utility/presentation/directives/is-required/is-required";
import {InvalidTooltipDirective} from "@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
	selector: 'form-input-password',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		IsRequiredDirective,
		InvalidTooltipDirective,
		ReactiveFormsModule,
	],
	template: `

		<!-- Floating Input -->
		<div class="relative">
			<input
				#passwordInput
				type="password"
				[formControl]="control()"
				[autocomplete]="autocomplete()"
				[placeholder]="placeholder()"
				isRequired
				invalidTooltip
				[id]="id() + '-input'"
				class="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
                      focus:pt-6
                      focus:pb-2
                      [&:not(:placeholder-shown)]:pt-6
                      [&:not(:placeholder-shown)]:pb-2
                      autofill:pt-6
                      autofill:pb-2">
			<label
				[for]="id() + '-input'"
				[id]="id() + '-label'"
				class="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
                        peer-focus:scale-90
                        peer-focus:translate-x-0.5
                        peer-focus:-translate-y-1.5
                        peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
                        peer-[:not(:placeholder-shown)]:scale-90
                        peer-[:not(:placeholder-shown)]:translate-x-0.5
                        peer-[:not(:placeholder-shown)]:-translate-y-1.5
                        peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500">
				{{ label() }}
			</label>
			<button
				role="button"
				(click)="passwordInput.type = passwordInput.type === 'text' ? 'password' : 'text'"
				class="absolute cursor-pointer end-0 flex hover:bg-neutral-50 inset-y-0 items-center m-1 p-2 peer-disabled:opacity-50 peer-disabled:pointer-events-none px-3 rounded-full transition-all">
				@if (passwordInput.type === 'password') {
					<svg class="shrink-0 size-5 text-gray-500 dark:text-neutral-500"
						 xmlns="http://www.w3.org/2000/svg"
						 fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round"
							  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
						<path stroke-linecap="round" stroke-linejoin="round"
							  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
					</svg>
				} @else {
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
						 stroke="currentColor" class="shrink-0 size-5 text-gray-500 dark:text-neutral-500">
						<path stroke-linecap="round" stroke-linejoin="round"
							  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"/>
					</svg>
				}
			</button>
		</div>
		<!-- End Floating Input -->
		<div class="flex w-full justify-between">
			<div></div>
			<div>
				<ng-content select="[label-bottom-end]"/>
			</div>
		</div>

	`
})
export class FormInputPasswordComponent {

	public readonly label = input('todo');

	public readonly id = input('utility-base-password');

	public readonly placeholder = input('');

	public readonly autocomplete = input('');

	public readonly disabled = input(false);

	public readonly control = input.required<FormControl>();


}
