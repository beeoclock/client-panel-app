import {ChangeDetectionStrategy, Component, input, ViewEncapsulation} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
	selector: 'app-radio-tailwindcss-component',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		ReactiveFormsModule
	],
	template: `
		<ul class="flex w-full overflow-x-scroll gap-2 md:overflow-x-hidden md:flex-wrap">

			@for (item of items(); track item.id) {

				<li>

					<input
						[id]="item.id"
						[formControl]="control()"
						[value]="item.id"
						type="radio"
						class="hidden peer"/>

					<label
						[for]="item.id"
						class="inline-flex bg-white rounded-2xl transition-all p-1 border-2 items-center justify-between text-gray-500 cursor-pointer peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100">

						<div class="flex items-center flex-nowrap">

							<div
								class="rounded-full bg-beeColor-400 min-h-7 min-w-7 max-h-7 max-w-7 h-7 w-7 flex justify-center items-center">

								@if (item?.avatar?.length) {

									<img [src]="item.avatar"
										 class="min-h-7 min-w-7 max-h-7 max-w-7 h-7 w-7 rounded-full object-cover"
										 [attr.alt]="item.label">

								} @else {

									@if (item.label.split(' '); as labelParts) {

										<div
											class="text-white text-xs font-bold">
											{{ labelParts?.[0]?.[0] ?? '' }}
										</div>

										<div
											class="text-white text-xs font-bold">
											{{ labelParts?.[1]?.[0] ?? '' }}
										</div>

									}

								}

							</div>
							<div class="w-full px-2 text-nowrap whitespace-nowrap">

								{{ item.label }}

							</div>

						</div>

					</label>

				</li>

			}

		</ul>

	`,
	host: {
		class: 'w-full'
	}
})
export class MemberRadioTailwindcssComponent {

	public readonly control = input.required<FormControl>();

	public readonly items = input.required<{
    id: string;
    label: string;
    avatar: string;
}[]>();

}
