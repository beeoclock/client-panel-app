import {BusinessCategoryEnum} from "@core/shared/enum/business-category.enum";
import {CurrencyCodeEnum, LanguageCodeEnum} from "@core/shared/enum";

export const DefaultServicesByBusinessCategory: {
	[key in keyof typeof LanguageCodeEnum]?: {
		[key in keyof typeof BusinessCategoryEnum]?: {
			title: string;
			durationVersions: { durationInSeconds: number; price: number | undefined; currency: CurrencyCodeEnum; }[]
		}[]
	}
} = {
	[LanguageCodeEnum.uk]: {
		[BusinessCategoryEnum.EyebrowStylist]: [
			{
				title: 'Вії - Класика або кутики',
				durationVersions: [
					{
						durationInSeconds: 60 * 60,
						price: 500,
						currency: CurrencyCodeEnum.UAH,
					},
					{
						durationInSeconds: 120 * 60,
						price: undefined,
						currency: CurrencyCodeEnum.UAH,
					},
				]
			},
			{
				title: 'Вії - 2-3D',
				durationVersions: [
					{
						durationInSeconds: 120 * 60,
						price: 600,
						currency: CurrencyCodeEnum.UAH,
					},
				]
			},
			{
				title: 'Вії - 4-5D',
				durationVersions: [
					{
						durationInSeconds: 120 * 60,
						price: 700,
						currency: CurrencyCodeEnum.UAH,
					},
					{
						durationInSeconds: 120 * 60 + 30 * 60,
						price: undefined,
						currency: CurrencyCodeEnum.UAH,
					},
				]
			},
			{
				title: 'Вії - Мокрий ефект',
				durationVersions: [
					{
						durationInSeconds: 120 * 60,
						price: 600,
						currency: CurrencyCodeEnum.UAH,
					},
				]
			},
			{
				title: 'Вії - Аніме ефект (верхні та нижні вії)',
				durationVersions: [
					{
						durationInSeconds: 120 * 60 + 30 * 60,
						price: 700,
						currency: CurrencyCodeEnum.UAH,
					},
				]
			},
			{
				title: 'Вії - зняття нарощення (без подальшого нарощення)',
				durationVersions: [
					{
						durationInSeconds: 30 * 60,
						price: 100,
						currency: CurrencyCodeEnum.UAH,
					},
				]
			},
			{
				title: 'Ламінування вій - ботокс та фарбування входить у вартість',
				durationVersions: [
					{
						durationInSeconds: 60 * 60,
						price: 500,
						currency: CurrencyCodeEnum.UAH,
					},
					{
						durationInSeconds: (60 * 60) + (30 * 60),
						price: undefined,
						currency: CurrencyCodeEnum.UAH,
					}
				]
			},
			{
				title: 'Корекція брів',
				durationVersions: [
					{
						durationInSeconds: 30 * 60,
						price: 100,
						currency: CurrencyCodeEnum.UAH,
					}
				]
			},
			{
				title: 'Довготривала укладка - фарбування та корекція входить у вартість',
				durationVersions: [
					{
						durationInSeconds: 60 * 60,
						price: 350,
						currency: CurrencyCodeEnum.UAH,
					}
				]
			},
			{
				title: '[КОМПЛЕКСИ] Ламінування брів та вій',
				durationVersions: [
					{
						durationInSeconds: (60 * 60) + (30 * 60),
						price: 700,
						currency: CurrencyCodeEnum.UAH,
					}
				]
			},

			// {
			// 	title: 'Корекція брів',
			// 	durationVersions: [
			// 		{
			//
			// 			durationInSeconds: 30 * 60,
			// 			price: 150,
			// 			currency: CurrencyCodeEnum.UAH,
			// 		}
			// 	]
			// },
			// {
			// 	title: 'Корекція та фарбування брів',
			// 	durationVersions: [
			// 		{
			// 			durationInSeconds: 60 * 60,
			// 			price: 300,
			// 			currency: CurrencyCodeEnum.UAH,
			// 		}
			// 	]
			// },
			// {
			// 	title: 'Довготривала укладка брів (ламінування)',
			// 	durationVersions: [
			// 		{
			// 			durationInSeconds: 60 * 60,
			// 			price: 400,
			// 			currency: CurrencyCodeEnum.UAH,
			// 		}
			// 	]
			// }
		],
		[BusinessCategoryEnum.Barbershop]: [
			{
				title: 'Чоловічка стрижка',
				durationVersions: [
					{

						durationInSeconds: 45 * 60,
						price: 250,
						currency: CurrencyCodeEnum.UAH,
					}
				]
			},
			{
				title: 'Жіноча стрижка',
				durationVersions: [
					{

						durationInSeconds: 60 * 60,
						price: 450,
						currency: CurrencyCodeEnum.UAH,
					}
				]
			},
			{
				title: 'Стрижка чолки',
				durationVersions: [
					{

						durationInSeconds: 30 * 60,
						price: 100,
						currency: CurrencyCodeEnum.UAH,
					}
				]
			},
			{
				title: 'Стрижка та борода',
				durationVersions: [
					{

						durationInSeconds: 60 * 60,
						price: 500,
						currency: CurrencyCodeEnum.UAH,
					}
				]
			},
			{
				title: 'Оформлення бороди',
				durationVersions: [
					{

						durationInSeconds: 30 * 60,
						price: 200,
						currency: CurrencyCodeEnum.UAH,
					}
				]
			},
			{
				title: 'Фарбування однотонне',
				durationVersions: [
					{

						durationInSeconds: 3 * 60 * 60,
						price: 1000,
						currency: CurrencyCodeEnum.UAH,
					}
				]
			},
			{
				title: 'Фарбування з висвітленням',
				durationVersions: [
					{
						durationInSeconds: 6 * 60 * 60,
						price: 3000,
						currency: CurrencyCodeEnum.UAH,
					}
				]
			}
		],
		[BusinessCategoryEnum.Manicurist]: [
			{
				title: 'Манікюр',
				durationVersions: [
					{

						durationInSeconds: 45 * 60,
						price: 300,
						currency: CurrencyCodeEnum.UAH,
					}
				]
			},
			{
				title: 'Педикюр',
				durationVersions: [
					{

						durationInSeconds: 60 * 60,
						price: 400,
						currency: CurrencyCodeEnum.UAH,
					}
				]
			},
			{
				title: 'Нарощення нігтів',
				durationVersions: [
					{

						durationInSeconds: 2 * 60 * 60,
						price: 1000,
						currency: CurrencyCodeEnum.UAH,
					}
				]
			}
		]
	}
}
