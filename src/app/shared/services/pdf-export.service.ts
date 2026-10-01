import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Service that exports a list of HTML blocks into a multi-page A4 PDF file.
 *
 * @service
 * @description Each block is rendered as an image at full width (never scaled down) and follows these rules:
 * - a block is never split: when it does not fit in the remaining space, it is moved to the next page;
 * - only exception: a block taller than a full page starts on a new page and is split across as many
 *   pages as needed, each cut being moved up to a free line so that no text line is ever cut in half.
 */
@Injectable({
  providedIn: 'root'
})
export class PdfExportService {

  /**
   * A4 page width in millimeters.
   * @private
   * @readonly
   * @type {number}
   */
  private readonly PAGE_WIDTH = 210;

  /**
   * A4 page height in millimeters.
   * @private
   * @readonly
   * @type {number}
   */
  private readonly PAGE_HEIGHT = 297;

  /**
   * Page margin in millimeters (applied on all sides).
   * @private
   * @readonly
   * @type {number}
   */
  private readonly MARGIN = 10;

  /**
   * Vertical space between two blocks in millimeters.
   * @private
   * @readonly
   * @type {number}
   */
  private readonly BLOCK_GAP = 5;

  /**
   * Rendering scale used by html2canvas to keep a sharp result.
   * @private
   * @readonly
   * @type {number}
   */
  private readonly RENDER_SCALE = 2;

  /**
   * JPEG quality used when embedding each block image into the PDF.
   * @private
   * @readonly
   * @type {number}
   */
  private readonly IMAGE_QUALITY = 0.92;

  /**
   * Renders each block into the PDF and triggers the file download.
   *
   * @public
   * @param {HTMLElement[]} blocks - Ordered list of HTML elements, each one being an unbreakable block
   * @param {string} fileName - Name of the downloaded file (without extension)
   * @returns {Promise<void>}
   */
  async exportBlocks(blocks: HTMLElement[], fileName: string): Promise<void> {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const usableWidth = this.PAGE_WIDTH - this.MARGIN * 2;
    const usableHeight = this.PAGE_HEIGHT - this.MARGIN * 2;
    let cursorY = this.MARGIN;

    for (const block of blocks) {

      // 1. Render the block into a canvas
      const canvas = await html2canvas(block, { scale: this.RENDER_SCALE, useCORS: true, backgroundColor: '#ffffff' });

      // 2. Fit the block to the usable width (the block is never scaled down)
      const imageHeight = (canvas.height * usableWidth) / canvas.width;

      // 3. Move the block to a new page if it does not fit in the remaining space
      const isPageStart = cursorY === this.MARGIN;
      if (!isPageStart && cursorY + imageHeight > this.MARGIN + usableHeight) {
        pdf.addPage();
        cursorY = this.MARGIN;
      }

      // 4. A block alone on its page but taller than it is the only one allowed to be split
      if (imageHeight > usableHeight) {
        cursorY = this.addSplitBlock(pdf, block, canvas, usableWidth, usableHeight);
        continue;
      }

      // 5. Draw the block and move the cursor below it
      pdf.addImage(canvas.toDataURL('image/jpeg', this.IMAGE_QUALITY), 'JPEG', this.MARGIN, cursorY, usableWidth, imageHeight);
      cursorY += imageHeight + this.BLOCK_GAP;
    }

    pdf.save(`${this.toFileName(fileName)}.pdf`);
  }

  /**
   * Draws a block taller than a full page by splitting it into slices, one slice per page.
   * Each cut is moved up to the nearest free line, so that no text line, image or table row
   * (in any column) is ever cut in half. Must be called at the top of an empty page.
   *
   * @private
   * @param {jsPDF} pdf - The PDF document being built
   * @param {HTMLElement} block - The HTML element of the block (used to locate the safe cut lines)
   * @param {HTMLCanvasElement} canvas - The rendered block
   * @param {number} usableWidth - Usable page width in millimeters
   * @param {number} usableHeight - Usable page height in millimeters
   * @returns {number} The vertical cursor position (in millimeters) right below the last slice
   */
  private addSplitBlock(pdf: jsPDF, block: HTMLElement, canvas: HTMLCanvasElement, usableWidth: number, usableHeight: number): number {
    const pixelsPerMillimeter = canvas.width / usableWidth;
    const sliceMaxHeight = Math.floor(usableHeight * pixelsPerMillimeter);
    const forbiddenRanges = this.getForbiddenRanges(block, canvas.height / block.getBoundingClientRect().height);
    let cursorY = this.MARGIN;
    let offsetY = 0;

    while (offsetY < canvas.height) {

      // 1. Add a new page for every slice after the first one
      if (offsetY > 0) pdf.addPage();

      // 2. Find where to cut the current slice without cutting any line
      const sliceEnd = this.findCutPosition(offsetY, sliceMaxHeight, canvas.height, forbiddenRanges);
      const sliceHeight = sliceEnd - offsetY;

      // 3. Copy the current slice of the block into its own canvas
      const slice = document.createElement('canvas');
      slice.width = canvas.width;
      slice.height = sliceHeight;
      slice.getContext('2d')?.drawImage(canvas, 0, offsetY, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);

      // 4. Draw the slice at the top of the page
      const sliceHeightMm = sliceHeight / pixelsPerMillimeter;
      pdf.addImage(slice.toDataURL('image/jpeg', this.IMAGE_QUALITY), 'JPEG', this.MARGIN, this.MARGIN, usableWidth, sliceHeightMm);
      cursorY = this.MARGIN + sliceHeightMm + this.BLOCK_GAP;
      offsetY = sliceEnd;
    }

    return cursorY;
  }

  /**
   * Returns the end position of a slice, moved up to the nearest position that crosses no forbidden range.
   * Falls back to a hard cut when no free line is found in the lower half of the page (e.g. a huge image).
   *
   * @private
   * @param {number} offsetY - Start of the slice in canvas pixels
   * @param {number} sliceMaxHeight - Maximum slice height (one full page) in canvas pixels
   * @param {number} canvasHeight - Total height of the block in canvas pixels
   * @param {Array<[number, number]>} forbiddenRanges - Vertical ranges that must not be cut, in canvas pixels
   * @returns {number} The end of the slice in canvas pixels
   */
  private findCutPosition(offsetY: number, sliceMaxHeight: number, canvasHeight: number, forbiddenRanges: Array<[number, number]>): number {
    const hardCut = offsetY + sliceMaxHeight;
    if (hardCut >= canvasHeight) return canvasHeight;

    // Move the cut above every range it crosses, until it crosses none (columns may overlap)
    let cut = hardCut;
    let crossedRange = forbiddenRanges.find(([top, bottom]) => top < cut && cut < bottom);
    while (crossedRange) {
      cut = Math.floor(crossedRange[0]);
      crossedRange = forbiddenRanges.find(([top, bottom]) => top < cut && cut < bottom);
    }

    return cut > offsetY + sliceMaxHeight / 2 ? cut : hardCut;
  }

  /**
   * Collects the vertical ranges of a block that must never be cut: every text line
   * (whatever the column), every image and every table row.
   *
   * @private
   * @param {HTMLElement} block - The HTML element of the block
   * @param {number} scale - Ratio between canvas pixels and CSS pixels
   * @returns {Array<[number, number]>} Vertical ranges [top, bottom] relative to the block, in canvas pixels
   */
  private getForbiddenRanges(block: HTMLElement, scale: number): Array<[number, number]> {
    const blockTop = block.getBoundingClientRect().top;
    const ranges: Array<[number, number]> = [];
    const toCanvas = (rect: DOMRect): [number, number] => [(rect.top - blockTop) * scale, (rect.bottom - blockTop) * scale];

    // 1. Every rendered line of every text node (one rect per line)
    const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    while (walker.nextNode()) {
      range.selectNodeContents(walker.currentNode);
      for (const rect of Array.from(range.getClientRects())) {
        if (rect.height > 0) ranges.push(toCanvas(rect));
      }
    }

    // 2. Images and table rows are kept whole
    block.querySelectorAll('img, tr').forEach(element => ranges.push(toCanvas(element.getBoundingClientRect())));

    return ranges;
  }

  /**
   * Converts a free text (e.g. an article title) into a safe file name.
   *
   * @private
   * @param {string} text - The text to convert
   * @returns {string} A lowercase file name without accents or special characters
   */
  private toFileName(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase() || 'article';
  }
}
