import {LanguageCodeEnum} from "@utility/domain/enum";
import {CountryCodeEnum} from "@utility/domain/enum/country-code.enum";

export const LanguageCountry = {
  [LanguageCodeEnum.en]: [CountryCodeEnum.PL],
  [LanguageCodeEnum.uk]: [CountryCodeEnum.UA],
  [LanguageCodeEnum.pl]: [CountryCodeEnum.PL],
  [LanguageCodeEnum.da]: [CountryCodeEnum.DK],
}
