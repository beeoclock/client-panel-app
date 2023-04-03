import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HasErrorDirective} from './has-error.directive';


@NgModule({
  declarations: [
    HasErrorDirective
  ],
  exports: [
    HasErrorDirective
  ],
  imports: [
    CommonModule
  ]
})
export class HasErrorModule {
}
