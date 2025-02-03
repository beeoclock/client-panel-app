import {CellCountryPrefixEnum} from "@utility/domain/enum/cell-country-prefix.enum";

export interface IContact {
  object: 'Contact';
  countryCode: CellCountryPrefixEnum;
  phoneNumber: string;
}
