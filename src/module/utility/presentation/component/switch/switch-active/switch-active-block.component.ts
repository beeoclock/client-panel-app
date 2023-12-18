import {Component, Input} from '@angular/core';
import {NgForOf} from "@angular/common";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {SwitchComponent} from "@utility/presentation/component/switch/switch.component";

@Component({
	selector: 'utility-form-switch-active-block-component',
	standalone: true,
	template: `
		<bee-card>

			<utility-switch-component
				[id]="id"
				[control]="control"
				[labelTranslateKey]="labelTranslateKey"
				[label]="label"/>

		</bee-card>
	`,
	imports: [
		ReactiveFormsModule,
		NgForOf,
		CardComponent,
		SwitchComponent,
	]
})
export class SwitchActiveBlockComponent {

	@Input()
	public label: unknown | string;

	@Input()
	public labelTranslateKey = 'keyword.capitalize.active';

	@Input()
	public id = '';

	@Input()
	public control = new FormControl(); // External control

}
