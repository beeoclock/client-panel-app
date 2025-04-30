import {Component, input} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";

interface ITag {
  name: string;
  tag: boolean;
}

@Component({
  selector: 'service-form-tags-component',
  standalone: true,
  template: `
    <ng-select id="service-form-tags-component"
      placeholder="Write or select tags"
      bindLabel="name"
      [multiple]="true"
      [addTag]="addTagFn"
      [hideSelected]="true"
      [items]="[]"
      [clearable]="true"
      [formControl]="form().controls.test" />
  `,
  imports: [
    TranslateModule,
    NgSelectModule,
    ReactiveFormsModule,
  ]
})
export class TagsComponent {

  public readonly form = input(new FormGroup({ test: new FormControl() }));

  public addTagFn(name: string): ITag {
    return {
      name,
      tag: true
    };
  }

}
