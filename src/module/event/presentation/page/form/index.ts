import {Component, ViewEncapsulation} from '@angular/core';
import {ContainerFormComponent} from "@event/presentation/component/form/container.form.component";
import {DefaultPanelComponent} from "@utility/presentation/component/panel/default.panel.component";
import {BackButtonComponent} from "@utility/presentation/component/button/back.button.component";

@Component({
	selector: 'event-form-page',
	template: `
		<utility-default-panel-component>
			<utility-back-button-component/>
		</utility-default-panel-component>
		<event-container-form-component/>
	`,
	encapsulation: ViewEncapsulation.None,
	imports: [
		ContainerFormComponent,
		DefaultPanelComponent,
		BackButtonComponent
	],
	standalone: true
})
export default class Index {

}
