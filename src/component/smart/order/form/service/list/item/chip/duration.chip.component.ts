import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	signal,
	ViewEncapsulation
} from "@angular/core";
import {IonDatetime, IonPopover} from "@ionic/angular/standalone";
import {NgSwitchCase} from "@angular/common";
import ObjectID from "bson-objectid";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {Reactive} from "@utility/cdk/reactive";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";
import {DateTime} from "luxon";
import {filter} from "rxjs";
import {is} from "thiis";

@Component({
	selector: 'app-duration-chip-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		IonPopover,
		NgSwitchCase,
		FormInputComponent,
		HumanizeDurationPipe,
		IonDatetime,
		ReactiveFormsModule
	],
	template: `
		<button
			[id]="'input-duration-' + id"
			class="px-3 py-2 rounded-lg border border-gray-200 justify-center items-center flex">
			<div class="text-slate-900 text-sm font-normal">
				⏳ {{ duration() | humanizeDuration }}
			</div>
		</button>
		<ion-popover [trigger]="'input-duration-' + id" [keepContentsMounted]="true">
			<ng-template>
				<ion-datetime
					presentation="time"
					[formControl]="durationFormControl"
					[showDefaultButtons]="true"/>
			</ng-template>
		</ion-popover>
	`
})
export class DurationChipComponent extends Reactive implements OnInit {

	@Input()
	public initialValue: number = 0;

	@Input()
	public id: string = ObjectID().toHexString();

	@Output()
	public readonly durationChanges = new EventEmitter<number>();

	public readonly durationFormControl = new FormControl<string>(DateTime.now().startOf('day').toJSDate().toISOString());

	public readonly duration = signal<number>(0)

	public ngOnInit() {

		this.durationFormControl.valueChanges.pipe(
			this.takeUntil(),
			filter(is.string)
		).subscribe((duration) => {
			const diffInSeconds = DateTime.fromISO(duration).diff(DateTime.fromISO(duration).startOf('day')).as('seconds');
			this.duration.set(diffInSeconds);
			this.durationChanges.emit(diffInSeconds);
		});

		this.durationFormControl.patchValue(DateTime.now().startOf('day').plus({
			seconds: this.initialValue
		}).toISO());

	}
}
