import {ChangeDetectionStrategy, Component, HostBinding, inject, Input, ViewEncapsulation} from "@angular/core";
import {IEvent, MEvent, RIEvent} from "@event/domain";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {Store} from "@ngxs/store";
import {EventCardComponent} from "@event/presentation/component/list/card/card.component";

@Component({
	selector: 'list-of-events-in-the-group-component',
	template: `
		<event-card-component *ngFor="let item of groupEvents;" [item]="toModel(item.data)"
													(singleClick)="openEventDetails($event)"/>
	`,
	standalone: true,
	imports: [
		DatePipe,
		NgIf,
		EventCardComponent,
		NgForOf,
		EventCardComponent
	],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListOfEventsInTheGroupComponent {

	@Input()
	public groupEvents!: {
		data: RIEvent;
		card: {
			startTime: number;
			durationInMinutes: number;
			column: number;
		};
	}[];

	@HostBinding()
	public class = 'flex flex-col gap-4 my-4';

	public toModel(event: IEvent): any {
		return MEvent.create(event);
	}

	private readonly store = inject(Store);

	public async openEventDetails(event: IEvent) {
		// this.store.dispatch(new EventActions.OpenDetailsById(event._id));
	}

}
