import {Component, input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {SwitchComponent} from "@utility/presentation/component/switch/switch.component";

@Component({
	selector: 'utility-form-switch-active-block-component',
	standalone: true,
	template: `
		<bee-card>

			<utility-switch-component
				[id]="id()"
				[control]="control()"
				[labelTranslateKey]="labelTranslateKey()"
				[label]="label()"/>

		</bee-card>
	`,
	imports: [
		ReactiveFormsModule,
		CardComponent,
		SwitchComponent,
	]
})
export class SwitchActiveBlockComponent {

	public readonly label = input<unknown | string>();

	public readonly labelTranslateKey = input('keyword.capitalize.active');

	public readonly id = input('');

	public readonly control = input(new FormControl()); // External control

}
