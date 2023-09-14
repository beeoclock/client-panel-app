import {Component, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'utility-404-page',
  templateUrl: 'index.html',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
	imports: [
		RouterLink,
		NgOptimizedImage
	]
})
export default class Index {

}
