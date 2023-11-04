export enum LanguageCodeEnum {
  en = 'en',
  pl = 'pl',
  uk = 'uk',
}

export const LanguageRecord: Record<LanguageCodeEnum, string> = {
  [LanguageCodeEnum.en]: 'English',
  [LanguageCodeEnum.uk]: 'Українська',
  [LanguageCodeEnum.pl]: 'Polski',
};

export const LANGUAGES: {
  code: LanguageCodeEnum;
  name: string;
}[] = Object.keys(LanguageRecord).map((code) => {
  return {
    code,
    name: LanguageRecord[code as keyof typeof LanguageCodeEnum]
  } as never;
});
