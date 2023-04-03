import {Component, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'utility-404-page',
  templateUrl: 'index.html',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterLink
  ]
})
export default class Index {

}
