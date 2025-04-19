import {CurrencyCodeEnum, LanguageCodeEnum} from "@core/shared/enum";
import {z} from "zod";

export interface TopUpBalanceDto {
	amount: number;
	currency: CurrencyCodeEnum;
	language: LanguageCodeEnum;
	redirectUrl: {
		cancelRedirectUrl: string;
		successRedirectUrl: string;
	};
}

export const TopUpBalanceDtoSchema = z.object({
	amount: z.coerce.number(),
	currency: z.nativeEnum(CurrencyCodeEnum),
	language: z.nativeEnum(LanguageCodeEnum),
	redirectUrl: z.object({
		cancelRedirectUrl: z.string(),
		successRedirectUrl: z.string(),
	}),
})
