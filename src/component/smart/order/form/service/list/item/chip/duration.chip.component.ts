import {
	ChangeDetectionStrategy,
	Component,
	input,
	OnChanges,
	OnInit,
	output,
	signal,
	SimpleChange,
	SimpleChanges,
	ViewEncapsulation
} from "@angular/core";
import {IonDatetime, IonPopover} from "@ionic/angular/standalone";
import ObjectID from "bson-objectid";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {Reactive} from "@utility/cdk/reactive";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";
import {DateTime} from "luxon";
import {filter} from "rxjs";
import {is} from "../../../../../../../../../core/shared/checker";
import {TranslateModule} from "@ngx-translate/core";

@Component({
	selector: 'app-duration-chip-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		IonPopover,
		HumanizeDurationPipe,
		IonDatetime,
		ReactiveFormsModule,
		TranslateModule
	],
	template: `
		<button
			[id]="'input-duration-' + id()"
			class="px-3 py-2 rounded-lg border border-gray-200 justify-center items-center flex">
			<div class="text-slate-900 text-sm font-normal">
				⏳ {{ duration() | humanizeDuration }}
			</div>
		</button>
		<ion-popover [trigger]="'input-duration-' + id()" [keepContentsMounted]="true">
			<ng-template>
				<ion-datetime
					presentation="time"
					[cancelText]="'keyword.capitalize.cancel' | translate"
					[doneText]="'keyword.capitalize.done' | translate"
					[formControl]="durationFormControl"
					[showDefaultButtons]="true"/>
			</ng-template>
		</ion-popover>
	`
})
export class DurationChipComponent extends Reactive implements OnInit, OnChanges {

	public readonly initialValue = input<number>(0);

	public readonly id = input<string>(ObjectID().toHexString());

	public readonly durationChanges = output<number>();

	public readonly durationFormControl = new FormControl<string>(DateTime.now().startOf('day').toJSDate().toISOString());

	public readonly duration = signal<number>(0);

	public ngOnChanges(changes: SimpleChanges & { initialValue: SimpleChange }) {
		if (changes.initialValue) {
			this.initFormControlValue(changes.initialValue.currentValue);
		}

	}

	public ngOnInit() {

		this.durationFormControl.valueChanges.pipe(
			this.takeUntil(),
			filter(is.string)
		).subscribe((duration) => {
			const diffInSeconds = DateTime.fromISO(duration).diff(DateTime.fromISO(duration).startOf('day')).as('seconds');

			if (this.duration() === diffInSeconds) {
				return;
			}
			this.duration.set(diffInSeconds);
			this.durationChanges.emit(diffInSeconds);
		});

		this.initFormControlValue(this.initialValue());

	}

	private initFormControlValue(seconds: number = 0) {
		this.durationFormControl.patchValue(DateTime.now().startOf('day').plus({
			seconds
		}).toISO());
	}
}
