import {
	ChangeDetectionStrategy,
	Component,
	HostBinding,
	inject,
	Input,
	OnChanges,
	SimpleChange,
	SimpleChanges,
	ViewEncapsulation
} from "@angular/core";
import {NgForOf, NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {NGXLogger} from "ngx-logger";

@Component({
	selector: 'event-from-to-chronology',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgForOf,
		TranslateModule,
		NgIf
	],
	template: `
		<div class="px-2">
			{{ fromToObject.objectName }}
		</div>
		<div
			*ngIf="value"
			class="flex flex-col bg-white border border-beeColor-200 rounded-lg divide-y divide-beeColor-200">
			<div class="flex divide-x divide-beeColor-200">
				<div class="text-center min-w-[26px] w-[26px] max-w-[26px] p-2 py-1 text-red-600 bg-red-50 rounded-tl-lg">-</div>
				<div class="flex-1 p-2 py-1" [innerHTML]="buildPresentation(value.from)">
				</div>
			</div>
			<div class="flex divide-x divide-beeColor-200">
				<div class="text-center min-w-[26px] w-[26px] max-w-[26px] p-2 py-1 text-green-600 bg-green-50 rounded-bl-lg">+</div>
				<div class="flex-1 p-2 py-1" [innerHTML]="buildPresentation(value.to)">
				</div>
			</div>
		</div>
		<ng-container *ngIf="isParent">
			<event-from-to-chronology
				*ngFor="let childFromToObject of childFromToObjectList"
				[fromToObject]="childFromToObject"/>
		</ng-container>
	`
})
export class FromToChronologyComponent implements OnChanges {

	@Input({required: true})
	public fromToObject!: {
		objectName: string;
		value: any;
	}; // JSON

	@HostBinding()
	public class = 'flex flex-col gap-2'

	private readonly ngxLogger = inject(NGXLogger);

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

	public ngOnChanges(changes: SimpleChanges & { fromToObject: SimpleChange }) {
		this.parse(changes.fromToObject.currentValue);
	}

	public buildPresentation(target: {
		type: string;
		value: any;
	}) {
		switch (target.type) {
			case 'string':
				return target.value;
			case 'number':
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
