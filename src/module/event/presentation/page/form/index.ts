import {Component, ViewEncapsulation} from '@angular/core';
import {ContainerFormComponent} from "@event/presentation/component/form/container.form.component";

@Component({
	selector: 'event-form-page',
	template: `
		<event-container-form-component/>
	`,
	encapsulation: ViewEncapsulation.None,
	imports: [
		ContainerFormComponent
	],
	standalone: true
})
export default class Index {

}
