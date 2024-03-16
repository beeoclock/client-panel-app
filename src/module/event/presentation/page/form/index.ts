import {Component, ViewEncapsulation} from '@angular/core';
import {ContainerFormComponent} from "@event/presentation/component/form/container.form.component";
import {BackButtonComponent} from "@utility/presentation/component/button/back.button.component";
import {DefaultPanelComponent} from "@utility/presentation/component/panel/default.panel.component";

@Component({
	selector: 'event-form-page',
	template: `
		<utility-default-panel-component>
			<utility-back-button-component #BackButtonComponent/>
		</utility-default-panel-component>
		<event-container-form-component [backButtonComponent]="BackButtonComponent"/>
	`,
	encapsulation: ViewEncapsulation.None,
	imports: [
		ContainerFormComponent,
		BackButtonComponent,
		DefaultPanelComponent
	],
	standalone: true
})
export default class Index {

}
