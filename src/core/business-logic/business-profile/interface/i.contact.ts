import {CellCountryPrefixEnum} from "@core/shared/enum/cell-country-prefix.enum";

export interface IContact {
  object: 'Contact';
  countryCode: CellCountryPrefixEnum;
  phoneNumber: string;
}
