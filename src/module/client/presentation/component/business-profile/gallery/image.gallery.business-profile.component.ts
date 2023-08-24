import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation} from "@angular/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {FormControl} from "@angular/forms";
import {extractFile} from "@utility/domain/extract-file";
import {file2base64} from "@utility/domain/file2base64";
import {NgIf} from "@angular/common";
import {DragAndDropDirective} from "@utility/presentation/directives/drag-and-drop/drag-and-drop.directive";

@Component({
  selector: 'client-image-gallery-business-profile-component',
  encapsulation: ViewEncapsulation.None,
  imports: [
    CardComponent,
    TranslateModule,
    NgIf,
    DragAndDropDirective
  ],
  standalone: true,
  template: `

    <div #labelOfDragAndDropZone dragAndDrop (fileDropped)="onFilesDropped($event)"
         class="flex items-center justify-center w-full z-50">
      <label [for]="'image-gallery-business-profile-dropzone-file-' + index"
             class="flex flex-col items-center justify-center w-full relative h-64 border-2 border-beeColor-300 border-dashed rounded-xl cursor-pointer bg-beeColor-50 hover:bg-beeColor-100 dark:hover:bg-beeDarkColor-800 dark:bg-beeColor-700 dark:border-beeDarkColor-600 dark:hover:border-beeDarkColor-500 dark:hover:bg-beeDarkColor-600">
        <img *ngIf="previewImage" [src]="previewImage"
             class="absolute top-0 left-0 object-cover z-10 rounded-xl w-full h-full" alt="Uploaded Image"/>
        <ng-container *ngIf="showPlaceholder">
          <ng-container *ngIf="isEmptyControl">
            <div
              class="absolute flex flex-col items-center justify-center h-full w-full pt-5 pb-6 z-20 bg-beeColor-50/25 px-4 rounded-xl text-beeColor-900">
              <svg class="w-8 h-8 mb-4 dark:text-beeColor-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                   fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p *ngIf="labelOfDragAndDropZone.classList.contains('fileover')"
                 class="mb-2 text-sm dark:text-beeColor-400 font-bold">
                {{ 'client.profile.form.section.coverImage.fileover' | translate }}
              </p>
              <ng-container *ngIf="!labelOfDragAndDropZone.classList.contains('fileover')">
                <p class="mb-2 text-sm dark:text-beeColor-400"><span
                  class="font-semibold">{{ 'keyword.capitalize.clickToUpload' | translate }}</span> {{ 'keyword.lowercase.or' | translate }} {{ 'keyword.lowercase.dragAndDrop' | translate }}
                </p>
                <p class="text-xs dark:text-beeColor-400">SVG, PNG, JPG {{ 'keyword.lowercase.or' | translate }} GIF</p>
              </ng-container>
            </div>
          </ng-container>
          <ng-container *ngIf="isNotEmptyControl">
            <button (click)="remove.emit()" class="transition-all hover:shadow-2xl hover:bg-beeColor-600 hover:text-beeColor-50 absolute right-4 top-4 px-6 py-5 text-xl bg-white z-10 rounded-full">
              <i class="bi bi-trash"></i>
            </button>
          </ng-container>
        </ng-container>
        <input [id]="'image-gallery-business-profile-dropzone-file-' + index" type="file" #fileInput class="hidden" (change)="onFileSelected($event)"
               accept="image/*"/>
      </label>
    </div>

  `
})
export class ImageGalleryBusinessProfileComponent implements OnInit {

  @ViewChild('fileInput')
  public readonly fileInput!: ElementRef<HTMLInputElement>;

  @Input()
  public control = new FormControl();

  @Input()
  public showPlaceholder = true;

  @Input()
  public index = 0;

  @Output()
  public readonly remove = new EventEmitter<void>();

  previewImage: string | null = null;
  uploadedFileName: string | null = null;

  public get isEmptyControl(): boolean {
    return !this.control.value;
  }

  public get isNotEmptyControl(): boolean {
    return !this.isEmptyControl;
  }

  public ngOnInit(): void {
    this.updatePreviewImage(this.control.value);
    this.initHandlerToUpdatePreviewImage();
  }

  public updatePreviewImage(value: string): void {
    this.previewImage = value;
  }

  public initHandlerToUpdatePreviewImage(): void {
    this.control.valueChanges.subscribe((value: string) => {
      this.updatePreviewImage(value);
    });
  }

  public async onFileSelected(event: Event): Promise<void> {

    try {

      const fileInput = event.target as HTMLInputElement;
      const file = extractFile(fileInput);
      await this.workWithFiles([file])

    } catch (e) {
      console.error(e);
    }

  }

  public async onFilesDropped(files: File[]): Promise<void> {
    await this.workWithFiles(files);
  }

  private async workWithFiles(files: File[]): Promise<void> {
    try {

      const file = files[0];
      this.uploadedFileName = file.name;
      const base64 = await file2base64(file);
      this.previewImage = base64;

      this.control.patchValue(base64);

    } catch (e) {
      console.error(e);
    }
  }

}
