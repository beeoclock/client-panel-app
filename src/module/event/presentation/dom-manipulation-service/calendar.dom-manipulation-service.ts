import {inject, Injectable} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {NGXLogger} from "ngx-logger";

@Injectable({
	providedIn: 'root'
})
export class CalendarDomManipulationService {

	private readonly ngxLogger = inject(NGXLogger);
	private readonly document = inject(DOCUMENT);

	public initExampleData(id: string) {
		const newDiv = document.createElement("div");
		// set absolute position
		newDiv.style.position = 'absolute';
		newDiv.innerHTML = `
			<div class="bg-blue-400/20 h-100 border-slate-100 dark:border-slate-200/5 text-xs p-1.5 text-right text-slate-400 uppercase dark:bg-slate-800 font-medium">
				00:00
			</div>
		`;
		const cell = document.getElementById(id);
		if (!cell) {
			return this;
		}

		// set relative position
		cell.style.position = 'relative';
		cell.appendChild(newDiv);

		return this;
	}

}
