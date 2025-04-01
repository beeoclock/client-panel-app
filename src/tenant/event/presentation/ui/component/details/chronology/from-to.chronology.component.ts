import {
	ChangeDetectionStrategy,
	Component,
	HostBinding,
	inject,
	input,
	OnChanges,
	SimpleChange,
	SimpleChanges,
	ViewEncapsulation
} from "@angular/core";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NGXLogger} from "ngx-logger";
import {is} from "@core/shared/checker";
import {DateTime} from "luxon";
import {HumanizeDurationHelper} from "@shared/helper/humanize/humanize-duration.helper";

@Component({
	selector: 'event-from-to-chronology',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
	],
	template: `
		<div class="px-2">
			{{ getTranslate(fromToObject().objectName) }}
		</div>
		@if (value) {

			<div
				class="flex flex-col bg-white border border-beeColor-200 rounded-lg divide-y divide-beeColor-200">
				<div class="flex divide-x divide-beeColor-200">
					<div title="from" class="text-center min-w-[26px] w-[26px] max-w-[26px] p-2 py-1 text-red-600 bg-red-50 rounded-tl-lg">-</div>
					<div class="flex-1 p-2 py-1" [innerHTML]="buildPresentation(value.from)">
					</div>
				</div>
				<div class="flex divide-x divide-beeColor-200">
					<div title="to" class="text-center min-w-[26px] w-[26px] max-w-[26px] p-2 py-1 text-green-600 bg-green-50 rounded-bl-lg">+</div>
					<div class="flex-1 p-2 py-1" [innerHTML]="buildPresentation(value.to)">
					</div>
				</div>
			</div>
		}
		@if (isParent) {
			@for (childFromToObject of childFromToObjectList; track childFromToObjectList)  {
				<event-from-to-chronology
					[fromToObject]="childFromToObject"/>
			}
		}
	`
})
export class FromToChronologyComponent implements OnChanges {

	public readonly fromToObject = input.required<{
		objectName: string;
		value: any;
	}>(); // JSON

	@HostBinding()
	public class = 'flex flex-col gap-2'
	public value: {
		from: {
			type: string;
			value: any;
		};
		to: {
			type: string;
			value: any;
		}
	} | null = null;
	public isParent = false;
	public readonly childFromToObjectList: {
		objectName: string;
		value: any;
	}[] = [];
	private readonly humanizeDurationHelper = inject(HumanizeDurationHelper);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly translateService = inject(TranslateService);

	public ngOnChanges(changes: SimpleChanges & { fromToObject: SimpleChange }) {
		this.parse(changes.fromToObject.currentValue);
	}

	public getTranslate(key: string) {
		const translateKey = `event.details.meta.history.keyword.capitalize.${key}`;
		const result = this.translateService.instant(translateKey);
		if (result === translateKey) {
			return key;
		}
		return result;
	}

	public buildPresentation(target: {
		type: string;
		value: any;
	}) {
		switch (target.type) {
			case 'string':
				switch (true) {
					case is.iso(target.value):
						return DateTime.fromISO(target.value).toFormat('yyyy-MM-dd HH:mm:ss');
					default:
						return target.value;
				}
			case 'number':
				if (this.fromToObject().objectName.toLowerCase().search('seconds')) {
					return this.humanizeDurationHelper.fromSeconds(target.value);
				}
				return target.value;
		}
	}

	private parse(fromToObject: {
		objectName: string;
		value: any;
	}) {

		this.ngxLogger.debug('parse: ', fromToObject);
		if ('from' in fromToObject.value || 'to' in fromToObject.value) {

			this.value = {
				from: {
					type: typeof fromToObject.value.from,
					value: fromToObject.value.from
				},
				to: {
					type: typeof fromToObject.value.to,
					value: fromToObject.value.to
				}
			};

			return;
		}
		this.isParent = true;
		this.childFromToObjectList.length = 0;

		Object.keys(fromToObject.value).forEach(key => {

			this.childFromToObjectList.push({
				objectName: key,
				value: fromToObject.value[key]
			})

		});

	}

}
