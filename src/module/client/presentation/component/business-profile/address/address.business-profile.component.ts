import {Component, Input, OnInit, ViewEncapsulation} from "@angular/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {NgIf} from "@angular/common";
import {DragAndDropDirective} from "@utility/presentation/directives/drag-and-drop/drag-and-drop.directive";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {AddressForm} from "@client/presentation/form/address.form";
import {PriceAndCurrencyComponent} from "@utility/presentation/component/input/country.component";

@Component({
  selector: 'client-address-business-profile-component',
  templateUrl: 'address.business-profile.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    CardComponent,
    TranslateModule,
    NgIf,
    DragAndDropDirective,
    FormInputComponent,
    PriceAndCurrencyComponent
  ],
  standalone: true
})
export class AddressBusinessProfileComponent implements OnInit {

  @Input()
  public form = new AddressForm();

  public ngOnInit(): void {

  }

}
