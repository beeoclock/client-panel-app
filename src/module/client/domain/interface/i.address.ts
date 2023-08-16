import {CountryEnum} from "@utility/domain/enum/country.enum";

export interface IAddress {
  object: 'Address';
  country: CountryEnum;
  city: string;
  zipCode: string;
  streetAddressLineOne: string;
  streetAddressLineTwo: string;
}
