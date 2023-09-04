import {Directive, ElementRef, inject, Input, OnChanges, SimpleChange, SimpleChanges} from "@angular/core";
import {ItemMediaApiAdapter} from "@module/media/adapter/external/api/item.media.api.adapter";
import {SrcByMediaIdService} from "@module/media/presentation/directive/src-by-media-id/src-by-media-id.service";

@Directive({
  selector: 'img[srcByMediaId]',
  standalone: true,
})
export class SrcByMediaIdDirective implements OnChanges {

  @Input()
  public srcByMediaId: string | undefined;

  @Input()
  public height: string | 'h-64' = 'h-64';

  private readonly itemMediaApiAdapter = inject(ItemMediaApiAdapter);
  private readonly srcByMediaIdService = inject(SrcByMediaIdService);
  private readonly elementRef: ElementRef<HTMLImageElement> = inject(ElementRef);
  private skeleton: HTMLDivElement | undefined;

  public ngOnChanges(changes: SimpleChanges & { srcByMediaId: SimpleChange }) {
    if (changes.srcByMediaId.currentValue !== changes.srcByMediaId.previousValue) {
      this.initialize(changes.srcByMediaId.currentValue);
    }
  }

  public initSkeleton(): void {

    if (this.skeleton) {
      return;
    }

    const skeleton = document.createElement('div');
    skeleton.setAttribute('role', 'status');
    skeleton.classList.add('space-y-8', 'animate-pulse', 'md:space-y-0', 'md:space-x-8', 'md:flex', 'md:items-center', this.height);
    skeleton.innerHTML = `
      <div class="flex items-center justify-center w-full h-full bg-gray-300 rounded-2xl dark:bg-gray-700">
        <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
          <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
        </svg>
      </div>
      <span class="sr-only">Loading...</span>
    `;

    this.skeleton = this.elementRef?.nativeElement?.parentElement?.appendChild?.(skeleton);

  }

  /**
   *
   * @param id
   * @private
   */
  private initialize(id: string): void {

    this.initSkeleton();

    this.srcByMediaIdService.get(id).then((value) => {

      if (value) {

        this.render(value);

      } else {

        this.itemMediaApiAdapter.execute$(id).subscribe((media) => {

          this.render(media.media!);
          this.srcByMediaIdService.set(id, media.media!);

        });

      }

    });

  }

  private render(src: string): void {

    this.elementRef.nativeElement.src = src;
    this.elementRef.nativeElement.classList.remove('hidden');
    this.skeleton?.remove();

  }

}
