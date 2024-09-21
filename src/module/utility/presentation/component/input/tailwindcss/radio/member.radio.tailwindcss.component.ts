import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from "@angular/core";
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

			@for (item of items; track item.id) {

				<li>

					<input
						[id]="item.id"
						[formControl]="control"
						[value]="item.id"
						type="radio"
						class="hidden peer"/>

					<label
						[for]="item.id"
						class="inline-flex bg-white rounded-2xl transition-all cursor-pointer p-1 border-2 items-center justify-between text-gray-500 cursor-pointer peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100">

						<div class="block max-w-24 h-40">

							<div
								class="rounded-2xl bg-beeColor-400 min-h-24 min-w-24 max-h-24 max-w-24 h-24 w-7 flex justify-center items-center">

								@if (item?.avatar?.length) {

									<img [src]="item.avatar"
										 class="min-h-24 min-w-24 max-h-24 max-w-24 h-24 w-24 rounded-2xl object-cover"
										 [attr.alt]="item.label">

								} @else {

									@if (item.label.split(' '); as labelParts) {

										<div
											class="text-white text-xs font-bold">
											{{ labelParts[0][0] ?? '' }}
										</div>

										<div
											class="text-white text-xs font-bold">
											{{ labelParts[1][0] ?? '' }}
										</div>

									}

								}

							</div>
							<div class="w-full">

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

	@Input({required: true})
	public control!: FormControl;

	@Input({required: true})
	public items: {
		id: string;
		label: string;
		avatar: string;
	}[] = [];

}
