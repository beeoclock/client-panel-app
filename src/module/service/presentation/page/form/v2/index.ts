import {Component, ViewEncapsulation} from '@angular/core';
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";
import {NgIf} from "@angular/common";
import {ImageBlockComponent} from "@service/presentation/component/form/v2/image/image-block.component";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {DetailsBlockComponent} from "@service/presentation/component/form/v2/details/details-block.component";
import {PricesBlockComponent} from "@service/presentation/component/form/v2/prices/prices-block.component";
import {
  SpecialistsBlockComponent
} from "@service/presentation/component/form/v2/specialists/specialists-block.component";
import {ServiceForm} from "@service/form/service.form";

@Component({
  selector: 'service-form-v2-page-component',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    BackLinkComponent,
    NgIf,
    ImageBlockComponent,
    ReactiveFormsModule,
    TranslateModule,
    DetailsBlockComponent,
    PricesBlockComponent,
    SpecialistsBlockComponent,
  ]
})
export default class Index {

  public readonly form = new ServiceForm();

  public save(): void {

  }

}
