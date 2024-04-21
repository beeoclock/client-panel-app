import {Component, ElementRef, HostBinding, HostListener, inject, OnInit, ViewEncapsulation} from "@angular/core";

@Component({
	selector: 'utility-push-box-resize-container',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: ``
})
export class PushBoxResizeContainerComponent implements OnInit {

	@HostBinding()
	public class = 'absolute left-0 top-0 bottom-0 w-1 bg-beeColor-200 transition-all hover:bg-blue-300 hover:shadow cursor-col-resize';

	private readonly elementRef = inject(ElementRef);

	@HostListener('mousedown', ['$event'])
	public onMouseDown(event: MouseEvent): void {

		event.preventDefault();

		const startX = event.clientX;
		const startWidth = this.elementRef.nativeElement.parentElement?.clientWidth || 0;

		const onMouseMove = (moveEvent: MouseEvent) => {

			const diff = moveEvent.clientX - startX;

			const newWidth = startWidth - (diff);

			this.updateWidth(newWidth);

			this.saveWidth(newWidth);

		};

		const onMouseUp = () => {
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseup', onMouseUp);
		};

		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseUp);
	}

	public ngOnInit() {
		const width = localStorage.getItem('push-box-width');
		if (width) {
			this.updateWidth(+width);
		}
	}

	public saveWidth(width: number) {
		localStorage.setItem('push-box-width', width.toString());
	}

	public updateWidth(width: number) {
		const {parentElement} = this.elementRef.nativeElement as {parentElement: HTMLElement};

		if (parentElement!.classList.contains('sm:min-w-[375px]')) {

			parentElement!.classList.remove('sm:min-w-[375px]');
			parentElement!.classList.remove('sm:max-w-[375px]');
			parentElement!.classList.remove('sm:w-[375px]');

			parentElement!.parentElement!.classList.remove('lg:min-w-[375px]');
			parentElement!.parentElement!.classList.remove('lg:max-w-[375px]');

		}

		parentElement!.style.width = `${width}px`;
		parentElement!.parentElement!.style.width = `${width}px`;
	}

}
