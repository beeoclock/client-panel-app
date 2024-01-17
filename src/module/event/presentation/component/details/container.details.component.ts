import {Component, HostBinding, Input} from "@angular/core";
import {AsyncPipe, NgIf} from "@angular/common";
import {ButtonsDetailsComponent} from "@event/presentation/component/details/buttons.details.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {GeneralDetailsComponent} from "@event/presentation/component/details/general.details.component";
import {MetaDetailsComponent} from "@event/presentation/component/details/meta.details.component";
import {RMIEvent} from "@event/domain";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";

@Component({
	selector: 'event-container-details-component',
	standalone: true,
	imports: [
		AsyncPipe,
		ButtonsDetailsComponent,
		CardComponent,
		GeneralDetailsComponent,
		MetaDetailsComponent,
		NgIf,
		LoaderComponent
	],
	template: `

		<ng-container *ngIf="useGrid; else WithoutGridTemplate">

			<div class="grid grid-cols-12 gap-4">

				<ng-container *ngIf="event; else LoadingTemplate">

					<div class="col-span-12 xl:col-start-3 xl:col-span-8 2xl:col-start-4 2xl:col-span-6 flex flex-col gap-4">

						<bee-card>
							<event-general-details [event]="event"/>
						</bee-card>

						<bee-card>
							<event-buttons-details [event]="event"/>
						</bee-card>

						<div class="text-start text-beeColor-400 text-sm px-4 lg:px-0">
							<event-meta-details [event]="event"/>
						</div>

					</div>

				</ng-container>

			</div>

		</ng-container>

		<ng-template #WithoutGridTemplate>

			<ng-container *ngIf="event; else LoadingTemplate">

				<div class="flex flex-col gap-4">

					<bee-card>
						<event-general-details [event]="event"/>
					</bee-card>

					<bee-card>
						<event-buttons-details [event]="event"/>
					</bee-card>

					<div class="text-start text-beeColor-400 text-sm px-4">
						<event-meta-details [event]="event"/>
					</div>

				</div>

			</ng-container>

		</ng-template>

		<ng-template #LoadingTemplate>
			<utility-loader/>
		</ng-template>
	`
})
export class ContainerDetailsComponent {

	@Input()
	public event!: RMIEvent;

	@Input()
	public useGrid = true;

	@HostBinding()
	public class = 'pb-48 block';

}
