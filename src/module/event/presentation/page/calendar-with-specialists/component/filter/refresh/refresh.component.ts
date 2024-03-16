import {Component} from "@angular/core";

@Component({
	selector: 'event-refresh-component',
	template: `
		<button (click)="refresh()">Refresh</button>
	`
})
export class RefreshComponent {

	public refresh(): void {

	}
}
