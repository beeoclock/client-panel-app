import {Component, input} from '@angular/core';
import {NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";

@Component({
  selector: 'service-form-prices-specialists-component',
  standalone: true,
  template: `
    <label [for]="id()">{{ label() }}</label>
    <ng-select [id]="id()"
      bindLabel="name"
      bindValue="code"
      [items]="[]"
      [clearable]="false"
      [formControl]="control()" />
  `,
  imports: [
    NgIf,
    TranslateModule,
    NgSelectModule,
    ReactiveFormsModule,
  ]
})
export class SpecialistsComponent {

  public readonly id = input('TODO');

  public readonly label = input('');

  public readonly control = input(new FormControl());

}
