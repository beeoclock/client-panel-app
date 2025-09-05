import {Component, input, ViewEncapsulation} from "@angular/core";
import {FormControl} from "@angular/forms";
import {CardComponent} from "@shared/presentation/ui/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {FacilityEnum} from "@core/shared/enum/facility.enum";

@Component({
	selector: 'client-facilities-business-profile-component',
	templateUrl: './facilities.business-profile.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		CardComponent,
		TranslateModule,
	],
	standalone: true
})
export class FacilitiesBusinessProfileComponent {

	public readonly control = input(new FormControl());

	public readonly baseTranslationKey = 'enum.facility.capitalize.';

	public readonly facilities: {
		id: FacilityEnum;
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
					id: FacilityEnum[facility],
					label: facility,
					icon: facilityIconMap[facility],
				};
			});
	}

	public isSelected(facility: FacilityEnum): boolean {
		return !!this.control().value?.includes(facility);
	}

	public toggleSelect(id: FacilityEnum): void {
		const value = this.control().value || [];
		if (value.includes(id)) {
			this.control().setValue(value.filter((v: FacilityEnum) => v !== id));
		} else {
			this.control().setValue([...value, id]);
		}
	}
}
