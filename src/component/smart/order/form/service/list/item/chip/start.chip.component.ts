import {ChangeDetectionStrategy, Component, inject, input, OnInit, output} from "@angular/core";
import {IonDatetime, IonPopover} from "@ionic/angular/standalone";
import {DatePipe} from "@angular/common";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import ObjectID from "bson-objectid";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {Reactive} from "@core/cdk/reactive";
import {DateTime} from "luxon";

@Component({
	selector: 'app-start-chip-component',
	standalone: true,
	styles: [
		`
			ion-popover {
				--width: auto;
			}
		`
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		IonPopover,
		TranslateModule,
		IonDatetime,
		ReactiveFormsModule,
		DatePipe
	],
	template: `
		<button
			[id]="'datetime-trigger-' + id()"
			class="px-3 py-2 rounded-lg border border-gray-200 justify-center items-center flex">
			<div class="text-slate-900 text-sm font-normal">
				⏰ {{ startFormControl.value | date: 'short' }}
			</div>
		</button>
		<ion-popover [trigger]="'datetime-trigger-' + id()" [keepContentsMounted]="true">
			<ng-template>
				<ion-datetime
					[locale]="locale"
					[lang]="locale"
					[showDefaultButtons]="true"
					[formControl]="startFormControl"
					[cancelText]="'keyword.capitalize.cancel' | translate"
					[doneText]="'keyword.capitalize.done' | translate">
					<div slot="time-label">
						{{ 'keyword.capitalize.time' | translate }}
					</div>
				</ion-datetime>
			</ng-template>
		</ion-popover>
	`
})
export class StartChipComponent extends Reactive implements OnInit {

	public readonly initialValue = input<string>();

	public readonly id = input<string>(ObjectID().toHexString());

	public readonly startChanges = output<string>();

	readonly #translateService = inject(TranslateService);

	public get locale(): string {
		return this.#translateService.currentLang;
	}

	public readonly startFormControl = new FormControl<string>(DateTime.now().toISO(), {
		nonNullable: true,
	});

	public ngOnInit() {

		let initialValue = DateTime.now().toISO();

		const initialValueValue = this.initialValue();
  if (initialValueValue) {
			initialValue = DateTime.fromISO(initialValueValue).toISO() ?? initialValue;
		}

		this.startFormControl.setValue(initialValue);

		this.startFormControl.valueChanges.pipe(
			this.takeUntil()
		).subscribe({
			next: (value) => {
				this.startChanges.emit(DateTime.fromISO(value).toJSDate().toISOString());
			}
		});

	}

}
