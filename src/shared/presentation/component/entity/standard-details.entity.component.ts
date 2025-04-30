import {ChangeDetectionStrategy, Component, input, ViewEncapsulation} from "@angular/core";
import {DynamicDatePipe} from "@shared/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslatePipe} from "@ngx-translate/core";
import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {ActiveStyleDirective} from "@shared/presentation/directives/active-style/active-style.directive";

@Component({
	standalone: true,
	selector: 'standard-details-entity',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'mb-[100px] p-2 flex'
	},
	template: `


		<details class="group w-full">
			<summary
				class="bg-neutral-50 hover:bg-neutral-100 transition-all text-neutral-400 group-hover:text-neutral-800 group-open:text-neutral-900 cursor-pointer flex font-medium items-center justify-between list-none p-2 px-4 rounded-[20px] group-open:rounded-b-none h-[42px]">
				<div class="flex w-full">
					<ul class="leading-tight flex gap-2 w-full ">
						<li class="flex gap-1 w-full">
							{{ 'Advanced information' | translate }}
						</li>
					</ul>
				</div>
				<div class="transition group-open:rotate-180 ml-2.5">
					<i class="bi bi-chevron-down"></i>
				</div>
			</summary>
			<div class="bg-neutral-50 group-open:animate-fadeIn px-4 rounded-b-[20px] flex flex-col">

				<div class="flex border-t items-center justify-between h-[42px]">
					<div>
						ID:
					</div>

					<div class="flex gap-5">
						{{ item()._id }}
					</div>
				</div>

				<div class="flex border-t items-center justify-between h-[42px]">
					<div>
						{{ 'keyword.capitalize.createdAt' | translate }}:
					</div>

					<div class="flex gap-5">
						{{ item().createdAt | dynamicDate }}
					</div>
				</div>

				<div class="flex border-t items-center justify-between h-[42px]">
					<div>
						{{ 'keyword.capitalize.updatedAt' | translate }}:
					</div>

					<div class="flex gap-5">
						{{ item().updatedAt | dynamicDate }}
					</div>
				</div>

				<div class="flex border-t items-center justify-between h-[42px]">
					<div>
						{{ 'keyword.capitalize.state' | translate }}:
					</div>

					<div class="flex gap-5">
						<div activeStyle [state]="item().state">
						</div>
					</div>
				</div>

				<div class="flex flex-col border-t w-full">
					<div class="py-2 text-neutral-400">
						{{ 'keyword.capitalize.historyOfStates' | translate }}:
					</div>


					@for (history of item().stateHistory; track history.setAt) {
						<div class="flex w-full border-t items-center justify-between h-[42px]">
							<div>
								{{ history.setAt | dynamicDate }}
							</div>

							<div class="flex gap-5">
								<div activeStyle [state]="history.state">
								</div>
							</div>
						</div>
					}
				</div>
			</div>
		</details>


	`,
	imports: [
		DynamicDatePipe,
		TranslatePipe,
		ActiveStyleDirective
	]
})
export class StandardDetailsEntityComponent {

	public readonly item = input.required<ABaseEntity>();

}
