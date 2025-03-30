import {ChangeDetectionStrategy, Component, input, OnInit, ViewEncapsulation} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {Reactive} from "@utility/cdk/reactive";

@Component({
	selector: 'settings-component',
	templateUrl: './settings.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		ReactiveFormsModule,
		TranslateModule,
	]
})
export class SettingsComponent extends Reactive implements OnInit {

	public readonly control = input(new FormControl<number>(1, {
		nonNullable: true
	}));

	private readonly key = 'calendar-with-specialist-settings-movement-in-minutes';

	public plus() {
		const currentValue = this.control().value;
		if (currentValue === 59) {
			return;
		}
		this.control().setValue(currentValue + 1);
	}

	public minus() {
		const currentValue = this.control().value;
		if (currentValue <= 1) {
			return;
		}
		this.control().setValue(currentValue - 1);
	}

	public ngOnInit(): void {
		this.control().valueChanges.pipe(this.takeUntil()).subscribe((value) => {
			if (value === null) {
				return;
			}
			if (value < 1) {
				this.control().setValue(1);
				return;
			}
			this.save();
		});
		this.restore();
	}

	private save(): void {
		localStorage.setItem(this.key, JSON.stringify(this.control().value));
	}

	private restore(): void {
		const value = localStorage.getItem(this.key);
		if (value) {
			this.control().setValue(+JSON.parse(value));
		}
	}

}
