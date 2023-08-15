import {Component, Input, ViewEncapsulation} from "@angular/core";
import {FormControl} from "@angular/forms";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {FacilityEnum} from "@utility/domain/enum/facility.enum";
import {NgForOf, NgIf} from "@angular/common";
import {SafePipe} from "@utility/pipes/safe.pipe";

@Component({
  selector: 'facilities-business-profile-component',
  templateUrl: 'facilities.business-profile.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    CardComponent,
    TranslateModule,
    NgForOf,
    NgIf,
    SafePipe
  ],
  standalone: true
})
export class FacilitiesBusinessProfileComponent {

  @Input()
  public control = new FormControl();

  public readonly facilities: {
    id: string;
    label: string;
    icon: string;
  }[];


  constructor() {

    const facilityIconMap = {
      [FacilityEnum.INTERNET]: 'bi bi-wifi',
      [FacilityEnum.ACCEPTING_CARD_PAYMENT]: 'bi bi-credit-card-2-front',
      [FacilityEnum.FREE_PARKING]: 'bi bi-p-circle',
      [FacilityEnum.ACCEPTING_CHILDREN]: 'bee-icon bee-icon-child-friendly',
      [FacilityEnum.ACCEPTING_PETS]: 'bee-icon bee-icon-paw',
      [FacilityEnum.ACCOMMODATIONS_FOR_PEOPLE_WITH_DISABILITIES]: 'bee-icon bee-icon-wheelchair',
    }

    this.facilities = Object.values(FacilityEnum)
      .map(facility => {
        return {
          id: facility,
          label: facility,
          icon: facilityIconMap[facility],
        };
      });
  }

}
