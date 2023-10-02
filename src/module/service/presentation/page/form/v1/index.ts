import {Component, HostBinding, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormComponent} from "@service/presentation/component/form/v1/form.component";
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'member-form-page',
  templateUrl: './index.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    FormComponent,
    BackLinkComponent,
    NgIf,
  ]
})
export default class Index {

  @ViewChild(FormComponent)
  public formComponent: FormComponent | undefined;

  @HostBinding()
  public readonly class = 'p-4 pb-48 block';

  public save(): void {
    this.formComponent?.save();
  }

}
