import {Component, ViewEncapsulation} from '@angular/core';
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {BodyCardComponent} from "@utility/presentation/component/card/body.card.component";
import {SpinnerComponent} from "@utility/presentation/component/spinner/spinner.component";

@Component({
  selector: 'utility-loader-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CardComponent,
    BodyCardComponent,
    SpinnerComponent
  ],
  template: `
    <utility-card-component class="border">
      <utility-body-card-component>
        <div class="d-flex align-items-center">
          <div spinner></div>
          <span class="ms-3">Loading...</span>
        </div>
      </utility-body-card-component>
    </utility-card-component>
  `
})
export class LoaderComponent {
}
