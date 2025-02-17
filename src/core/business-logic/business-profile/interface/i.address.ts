import {CountryCodeEnum} from "@core/shared/enum/country-code.enum";

export interface IAddress {
  object: 'Address';
  country: CountryCodeEnum;
  city: string;
  zipCode: string;
  streetAddressLineOne: string;
  streetAddressLineTwo: string;
  customLink?: string | null;
}
