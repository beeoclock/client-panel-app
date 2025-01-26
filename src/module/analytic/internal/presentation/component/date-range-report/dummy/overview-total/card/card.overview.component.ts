import {ChangeDetectionStrategy, Component, Input, input, ViewEncapsulation} from "@angular/core";

@Component({
	selector: 'card-overview',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	template: `
		<!-- Card -->
		<div
			class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
			<div class="p-2">
				<div class="flex items-center gap-x-2">
					<p class="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
						{{ label() }}
					</p>
				</div>

				@if (value || value === 0) {
					<div class="mt-1 flex items-center gap-x-2">
						<h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
							{{ value }}
						</h3>
					</div>
				}
			</div>
		</div>
		<!-- End Card -->
	`
})
export class CardOverviewComponent {
	public readonly label = input.required<string>();

	@Input({required: true})
	public value: string | number | null = 0;
}
