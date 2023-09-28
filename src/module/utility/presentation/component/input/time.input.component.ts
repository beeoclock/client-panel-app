import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {InputIconComponent} from "@utility/presentation/component/input/input-icon.component";
import {extractSecondsFrom_hh_mm_ss, secondsTo_hh_mm} from "@utility/domain/time";
import {InputBadgeComponent} from "@utility/presentation/component/input/input-badge.component";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'time-input-component',
  standalone: true,
	imports: [
		InputIconComponent,
		InputBadgeComponent,
		TranslateModule,
	],
  template: `
		<bee-form-badge-input
			mask="Hh:m0"
			placeholder="00:00"
			[control]="localControl"
			[label]="label"
			[id]="id"
			[badge]="'keyword.capitalize.priceTimeFormatPrompt' | translate"/>

<!--    <form-icon-input-->
<!--      [id]="id"-->
<!--      placeholder="00:00"-->
<!--      mask="00:00"-->
<!--      icon="bi-clock"-->
<!--      [control]="localControl"-->
<!--      [label]="label"/>-->
  `
})
export class TimeInputComponent implements OnInit {

  @Input()
  public control: FormControl = new FormControl();

  public localControl: FormControl = new FormControl();

  @Input()
  public label = '';

  @Input()
  public id = '';

  @Input()
  public valueAsNumber = true;

  @Input()
  public utc = true;

	public ngOnInit(): void {

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

	}

}
