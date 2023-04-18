import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TogglePasswordDirective} from './toggle-password.directive';


@NgModule({
  declarations: [
    TogglePasswordDirective
  ],
  exports: [
    TogglePasswordDirective
  ],
  imports: [
    CommonModule
  ]
})
export class TogglePasswordModule {
}
