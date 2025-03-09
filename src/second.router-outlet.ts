import {Component, effect, ElementRef, inject, Renderer2, signal, ViewEncapsulation} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {WhacAMoleResizeContainer} from "@utility/presentation/whac-a-mole/whac-a-mole.resize-container";

@Component({
	selector: 'app-second-router-outlet',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		RouterModule,
		WhacAMoleResizeContainer,
	],
	template: `
		<div class="w-full max-md:!w-full top-0 right-0 h-screen z-50 flex flex-col lg:relative">
			<whac-a-mole-resize-container class="max-md:hidden" (widthChanges)="widthChanges($event)"
										  (mouseDownUp)="mouseDownUp($event)"/>
			<div class="flex justify-between p-1 border-b">
				<div class="truncate font-bold p-2">Informacje o pracowniku</div>
				<div class="flex gap-2">
					<button (click)="close()" type="button" class="hover:bg-neutral-200 p-2 px-3 rounded-lg transition-all" title="Close">
						<i class="bi bi-x-lg"></i>
					</button>
				</div>
			</div>
			<div
				class="w-full h-[calc(100%-50px)] md:pl-1 flex-1 [&>*:not(router-outlet)]:block [&>*:not(router-outlet)]:h-full [&>*:not(router-outlet)]:overflow-auto">
				<router-outlet name="second" (activate)="activate($event)" (deactivate)="deactivate($event)"/>
			</div>

		</div>
    `,
	host: {
		class: 'flex transition-all relative max-md:absolute max-md:w-full max-md:z-[100] bg-white'
	}
})
export class SecondRouterOutlet {

	public readonly activated = signal<any>(null);

	private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
	private readonly renderer2 = inject(Renderer2);
	private readonly router = inject(Router);

	public width = 0;

	public constructor() {
		effect(() => {
			this.updateState();
		});
	}

	public close() {
		this.router.navigate([{outlets: {second: null}}]).then();
	}

	public activate($event: undefined) {
		this.activated.set($event);
	}

	public deactivate($event: undefined) {
		this.activated.set(null);
	}

	public mouseDownUp($event: boolean) {
		if ($event) {
			this.renderer2.removeClass(this.elementRef.nativeElement, 'transition-all');
		} else {
			this.renderer2.addClass(this.elementRef.nativeElement, 'transition-all');
		}
	}

	public widthChanges($event: number) {
		this.width = $event;
		this.updateState();
	}

	private updateState() {
		if (this.activated()) {
			this.renderer2.setStyle(this.elementRef.nativeElement, 'margin-right', `${0}px`);
		} else {
			this.renderer2.setStyle(this.elementRef.nativeElement, 'margin-right', `-${this.width}px`);
		}
	}
}
