import {UnitTranslationOptions} from "humanize-duration";

export const LanguagesHumanizeDurationHelper: Record<string, UnitTranslationOptions> = {
	short_en: {
		y: () => "y",
		mo: () => "mo",
		w: () => "w",
		d: () => "d",
		h: () => "h",
		m: () => "m",
		s: () => "s",
		ms: () => "ms",
	},
	short_uk: {
		y: () => "р",
		mo: () => "міс",
		w: () => "тиж",
		d: () => "д",
		h: () => "г",
		m: () => "хв",
		s: () => "сек",
		ms: () => "мсек",
	},
	short_pl: {
		y: () => "r",
		mo: () => "m",
		w: () => "tyg",
		d: () => "dn",
		h: () => "g",
		m: () => "min",
		s: () => "sek",
		ms: () => "ms",
	},
	short_da: {
		y: () => "år",
		mo: () => "mdr",
		w: () => "uge",
		d: () => "d",
		h: () => "t",
		m: () => "m",
		s: () => "s",
		ms: () => "ms",
	},
};
