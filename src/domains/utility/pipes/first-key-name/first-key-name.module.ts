import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FirstKeyNamePipe} from './first-key-name.pipe';

@NgModule({
  declarations: [
    FirstKeyNamePipe
  ],
  exports: [
    FirstKeyNamePipe
  ],
  imports: [
    CommonModule
  ]
})
export class FirstKeyNameModule {
}
