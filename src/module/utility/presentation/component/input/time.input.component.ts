import {Component, Input, OnInit} from '@angular/core';
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
			[id]="id"
			[showLabel]="showLabel"
			[label]="label"
			[control]="localControl"
			[additionalClassList]="additionalClassList"
			placeholder="00:00"
			type="time">
			<ng-content/>
		</form-input>
  `
})
export class TimeInputComponent implements OnInit {

	@Input({required: true})
	public control!: FormControl;

  public readonly localControl = new FormControl();

  @Input()
  public label = '';

  @Input()
  public id = '';

  @Input()
  public customClassList: string = '';

  @Input()
  public additionalClassList: string = '';

  @Input()
  public valueAsNumber = true;

  @Input()
  public showLabel = true;

  @Input()
  public utc = false;

	public ngOnInit(): void {

		// Values
		if (this.valueAsNumber) {
			this.localControl.patchValue(secondsTo_hh_mm(this.control.value, this.utc));
		} else {
			this.localControl.patchValue(this.control.value);
		}
		this.localControl.valueChanges.subscribe((value) => {
			if (this.valueAsNumber) {
				this.control.patchValue(extractSecondsFrom_hh_mm_ss(value, this.utc));
			} else {
				this.control.patchValue(value);
			}
		});

		// Errors
		this.localControl.setErrors(this.control.errors);
		this.control.statusChanges.subscribe(() => {
			this.localControl.setErrors(this.control.errors);
		})

	}

}
