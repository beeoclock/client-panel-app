import {Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {FormControl} from "@angular/forms";
import {extractFile} from "@utility/domain/extract-file";
import {file2base64} from "@utility/domain/file2base64";
import {NgIf} from "@angular/common";
import {BooleanState} from "@utility/domain";
import {DragAndDropDirective} from "@utility/presentation/directives/drag-and-drop/drag-and-drop.directive";

@Component({
  selector: 'client-cover-image-business-profile-component',
  templateUrl: 'cover-image.business-profile.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    CardComponent,
    TranslateModule,
    NgIf,
    DragAndDropDirective
  ],
  standalone: true
})
export class CoverImageBusinessProfileComponent implements OnInit {

  @ViewChild('fileInput')
  public readonly fileInput!: ElementRef<HTMLInputElement>;

  @Input()
  public control = new FormControl();

  previewImage: string | null = null;
  uploadedFileName: string | null = null;

  public readonly toggleInfo = new BooleanState(true);

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
