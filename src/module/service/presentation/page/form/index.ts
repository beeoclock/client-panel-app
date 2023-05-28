import {Component, HostBinding, ViewChild, ViewEncapsulation} from '@angular/core';
import {ServiceRepository} from '@service/repository/service.repository';
import {FormComponent} from "@service/presentation/component/form/form.component";
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'employee-form-page',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    FormComponent,
    BackLinkComponent,
    NgIf,
  ],
  providers: [
    ServiceRepository,
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
