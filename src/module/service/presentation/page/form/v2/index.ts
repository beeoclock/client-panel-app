import {Component, HostBinding, ViewEncapsulation} from '@angular/core';
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'member-form-page',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    BackLinkComponent,
    NgIf,
  ]
})
export default class Index {

  @HostBinding()
  public readonly class = 'p-4 pb-48 block';

}
