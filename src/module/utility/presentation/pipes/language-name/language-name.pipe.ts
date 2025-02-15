import {Pipe, PipeTransform} from "@angular/core";
import {LanguageCodeEnum, LanguageRecord} from "src/core/shared/enum";

@Pipe({
	name: 'languageName',
	pure: true,
	standalone: true
})
export class LanguageNamePipe implements PipeTransform {

	public transform(value: LanguageCodeEnum) {
		return LanguageRecord[value];
	}

}
