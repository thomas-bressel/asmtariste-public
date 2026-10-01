import { Component, ElementRef, afterNextRender, computed, inject, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';

import { PdfExportService } from '@services/pdf-export.service';
import { NotificationService } from '@services/ui/notification.service';

import { ArticleData } from '@models/article.model';

/**
 * Off-screen rendering of a whole article, used to archive it as an A4 PDF file.
 *
 * @component
 * @selector div[app-archive-pdf]
 * @description Renders every page of the article with the same markup and styles as the article page,
 * captures each block (header, then every content block) and downloads the PDF.
 * The component exports the article as soon as it is rendered, then emits exportDone
 * so that the parent can remove it.
 * @example
 * <div app-archive-pdf
 *      [article]="article"
 *      [pages]="contentsByPages()"
 *      [baseUrl]="baseUrlAPI"
 *      (exportDone)="isArchiving.set(false)">
 * </div>
 */
@Component({
  selector: 'div[app-archive-pdf]',
  imports: [DatePipe],
  templateUrl: './archive-pdf.html',
  styleUrls: ['../article.scss', './archive-pdf.scss'],
})
export class ArchivePdf {

  /**
   * Host element, used to find the blocks to capture.
   * @private
   * @readonly
   * @type {ElementRef<HTMLElement>}
   */
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  /**
   * PDF export service building the A4 document.
   * @private
   * @readonly
   * @type {PdfExportService}
   */
  private readonly pdfExportService = inject(PdfExportService);

  /**
   * Notification service for displaying the export result.
   * @private
   * @readonly
   * @type {NotificationService}
   */
  private readonly notificationService = inject(NotificationService);

  /**
   * Article to archive.
   * @input
   */
  public readonly article = input.required<ArticleData>();

  /**
   * Content of the article organized by pages.
   * @input
   */
  public readonly pages = input<any[]>([]);

  /**
   * Base URL of the static images.
   * @input
   */
  public readonly baseUrl = input<string>('');

  /**
   * Event emitted once the export is over (success or failure).
   * @output
   */
  public readonly exportDone = output<void>();

  /**
   * Query string appended to every image URL of the archive.
   * Forces a fresh CORS request: an image already cached without CORS headers
   * would otherwise be rejected by html2canvas and appear blank in the PDF.
   * @public
   * @readonly
   * @type {string}
   */
  public readonly cacheBuster: string = '?archive=' + Date.now();

  /**
   * Computed signal containing the base URL of the article images.
   * @public
   * @type {Signal<string>}
   */
  public readonly imageUrl = computed(() => this.baseUrl() + '/articles/' + this.article().id_articles + '/');

  /**
   * Constructor that triggers the export as soon as every block has been rendered off-screen.
   */
  constructor() {
    afterNextRender(() => this.exportArticle());
  }

  /**
   * Captures every rendered block and downloads the article as an A4 PDF file.
   * Always emits exportDone at the end so the parent can remove this component.
   *
   * @private
   * @returns {Promise<void>}
   */
  private async exportArticle(): Promise<void> {
    try {
      // 1. Wait for every image to be loaded, otherwise they would be blank in the PDF
      await this.waitForImages();

      // 2. Collect the blocks in reading order and build the PDF
      const blocks = Array.from(this.elementRef.nativeElement.querySelectorAll<HTMLElement>('.archive__block'));
      await this.pdfExportService.exportBlocks(blocks, this.article().title);

      this.notificationService.show('archive.success', 3000);

    } catch (error) {
      console.error('Erreur lors de la création du PDF :', error);
      this.notificationService.show('archive.error', 5000);
    } finally {
      this.exportDone.emit();
    }
  }

  /**
   * Resolves once every image of the component is loaded (or failed to load).
   * A broken image must not block the export, so errors are resolved as well.
   *
   * @private
   * @returns {Promise<void[]>}
   */
  private waitForImages(): Promise<void[]> {
    const images = Array.from(this.elementRef.nativeElement.querySelectorAll('img'));

    return Promise.all(images.map(image => new Promise<void>(resolve => {
      if (image.complete) return resolve();
      image.addEventListener('load', () => resolve(), { once: true });
      image.addEventListener('error', () => resolve(), { once: true });
    })));
  }
}
