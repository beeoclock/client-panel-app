import {Component, Input} from "@angular/core";
import {AsyncPipe, NgIf} from "@angular/common";
import {ButtonsDetailsComponent} from "@event/presentation/component/details/buttons.details.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {GeneralDetailsComponent} from "@event/presentation/component/details/general.details.component";
import {MetaDetailsComponent} from "@event/presentation/component/details/meta.details.component";
import {RMIEvent} from "@event/domain";

@Component({
	selector: 'event-container-details-component',
	standalone: true,
	imports: [
		AsyncPipe,
		ButtonsDetailsComponent,
		CardComponent,
		GeneralDetailsComponent,
		MetaDetailsComponent,
		NgIf
	],
	template: `
		<div class="pb-48 grid grid-cols-12 gap-4">

			<ng-container *ngIf="event">

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
	`
})
export class ContainerDetailsComponent {

	@Input()
	public event!: RMIEvent;

}
