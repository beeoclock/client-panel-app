import {Component, input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {InputIconComponent} from "@utility/presentation/component/input/input-icon.component";
import {extractSecondsFrom_hh_mm_ss, secondsTo_hh_mm} from "@utility/domain/time";
import {InputBadgeComponent} from "@utility/presentation/component/input/input-badge.component";
import {TranslateModule} from "@ngx-translate/core";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";

@Component({
  selector: 'time-input-component',
  standalone: true,
	imports: [
		InputIconComponent,
		InputBadgeComponent,
		TranslateModule,
		FormInputComponent,
	],
  template: `
		<form-input
			[id]="id()"
			[label]="label()"
			[control]="localControl"
			placeholder="00:00"
			inputType="time">
			<ng-content/>
		</form-input>
  `
})
export class TimeInputComponent implements OnInit {

	public readonly control = input.required<FormControl>();

  public readonly localControl = new FormControl();

  public readonly label = input('');

  public readonly id = input('');

  public readonly valueAsNumber = input(true);

  public readonly utc = input(false);

	public ngOnInit(): void {

		// Values
		const control = this.control();
  if (this.valueAsNumber()) {
			this.localControl.patchValue(secondsTo_hh_mm(control.value, this.utc()));
		} else {
			this.localControl.patchValue(control.value);
		}
		this.localControl.valueChanges.subscribe((value) => {
			if (this.valueAsNumber()) {
				this.control().patchValue(extractSecondsFrom_hh_mm_ss(value, this.utc()));
			} else {
				this.control().patchValue(value);
			}
		});

		// Errors
		this.localControl.setErrors(control.errors);
		control.statusChanges.subscribe(() => {
			this.localControl.setErrors(this.control().errors);
		})

	}

}
