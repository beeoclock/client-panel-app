export enum LanguageCodeEnum {
  en = 'en',
  pl = 'pl',
  uk = 'uk',
}


export const LANGUAGES: {
  code: LanguageCodeEnum;
  name: string;
}[] = [
  {
    code: LanguageCodeEnum.en,
    name: 'English'
  },
  {
    code: LanguageCodeEnum.uk,
    name: 'Українська'
  },
  {
    code: LanguageCodeEnum.pl,
    name: 'Polski'
  },
];
