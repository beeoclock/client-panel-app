import {Component, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'identity-login-page',
  templateUrl: 'index.html',
  standalone: true,
  imports: [
    RouterLink
  ],
  encapsulation: ViewEncapsulation.None
})
export default class Index {

}