import {Component, ViewEncapsulation} from '@angular/core';
import {FilterComponent} from "@event/presentation/component/filter/filter.component";
import {NgIf} from "@angular/common";

@Component({
	selector: 'event-calendar-page',
	templateUrl: './index.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		FilterComponent,
		NgIf
	],
	standalone: true
})
export default class Index {

}
