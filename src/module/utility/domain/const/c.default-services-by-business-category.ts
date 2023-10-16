import {BusinessCategoryEnum} from "@utility/domain/enum/business-category.enum";
import {CurrencyCodeEnum, LanguageCodeEnum} from "@utility/domain/enum";

export const DefaultServicesByBusinessCategory: {
	[key in keyof typeof LanguageCodeEnum]?: {
		[key in keyof typeof BusinessCategoryEnum]?: {title: string; durationInSeconds: number; price: number; currency: CurrencyCodeEnum}[]
	}
} = {
	[LanguageCodeEnum.uk]: {
		[BusinessCategoryEnum.Barbershop]: [
			{
				title: 'Чоловічка стрижка',
				durationInSeconds: 45 * 60,
				price: 250,
				currency: CurrencyCodeEnum.UAH,
			},
			{
				title: 'Жіноча стрижка',
				durationInSeconds: 60 * 60,
				price: 450,
				currency: CurrencyCodeEnum.UAH,
			},
			{
				title: 'Стрижка чолки',
				durationInSeconds: 30 * 60,
				price: 100,
				currency: CurrencyCodeEnum.UAH,
			},
			{
				title: 'Стрижка та борода',
				durationInSeconds: 60 * 60,
				price: 500,
				currency: CurrencyCodeEnum.UAH,
			},
			{
				title: 'Оформлення бороди',
				durationInSeconds: 30 * 60,
				price: 200,
				currency: CurrencyCodeEnum.UAH,
			},
			{
				title: 'Фарбування однотонне',
				durationInSeconds: 3 * 60 * 60,
				price: 1000,
				currency: CurrencyCodeEnum.UAH,
			},
			{
				title: 'Фарбування з висвітленням',
				durationInSeconds: 6 * 60 * 60,
				price: 3000,
				currency: CurrencyCodeEnum.UAH,
			}
		],
		[BusinessCategoryEnum.EyebrowStylist]: [
			{
				title: 'Корекція брів',
				durationInSeconds: 30 * 60,
				price: 150,
				currency: CurrencyCodeEnum.UAH,
			},
			{
				title: 'Корекція та фарбування брів',
				durationInSeconds: 60 * 60,
				price: 300,
				currency: CurrencyCodeEnum.UAH,
			},
			{
				title: 'Довготривала укладка брів (ламінування)',
				durationInSeconds: 60 * 60,
				price: 400,
				currency: CurrencyCodeEnum.UAH,
			}
		],
		[BusinessCategoryEnum.Manicurist]: [
			{
				title: 'Манікюр',
				durationInSeconds: 45 * 60,
				price: 300,
				currency: CurrencyCodeEnum.UAH,
			},
			{
				title: 'Педикюр',
				durationInSeconds: 60 * 60,
				price: 400,
				currency: CurrencyCodeEnum.UAH,
			},
			{
				title: 'Нарощення нігтів',
				durationInSeconds: 2 * 60 * 60,
				price: 1000,
				currency: CurrencyCodeEnum.UAH,
			}
		]
	}
}
