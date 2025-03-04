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
import {NgForOf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {NGXLogger} from "ngx-logger";
import {FromToChronologyComponent} from "@event/presentation/component/details/chronology/from-to.chronology.component";

@Component({
	selector: 'event-list-from-to-chronology',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgForOf,
		TranslateModule,
		FromToChronologyComponent
	],
	template: `
		<event-from-to-chronology *ngFor="let fromToObject of fromToObjectList" [fromToObject]="fromToObject"/>
	`
})
export class ListFromToChronologyComponent implements OnChanges {

	public readonly valueWithFromToProperties = input.required<string>(); // JSON

	@HostBinding()
	public class = 'flex flex-col gap-2'

	public readonly fromToObjectList: {
		objectName: string;
		value: any;
	}[] = [];

	private readonly ngxLogger = inject(NGXLogger);

	public ngOnChanges(changes: SimpleChanges & { valueWithFromToProperties: SimpleChange }) {
		this.parse(changes.valueWithFromToProperties.currentValue);
	}

	private parse(valueWithFromToProperties: string) {

		this.fromToObjectList.length = 0;

		const parsedValue = JSON.parse(valueWithFromToProperties);
		this.ngxLogger.debug('prepareChronology: ', parsedValue);

		if ('from' in parsedValue && 'to' in parsedValue) {
			this.ngxLogger.warn('Something went wrong, check it!');
			this.fromToObjectList.push({
				objectName: '',
				value: parsedValue
			})
			return;
		}

		Object.keys(parsedValue).forEach(key => {

			this.fromToObjectList.push({
				objectName: key,
				value: parsedValue[key]
			})

		});

	}

}
