import { Injectable, signal, computed } from '@angular/core';
import { ContentData } from '@models/content.model';

/**
 * Represents a single column within a content block
 */
interface ContentColumn {
  position: number;
  id_column?: number | null;
  id_title: number | null;
  title_text: string | null;
  id_text: number | null;
  text_content: string | null;
  id_image: number | null;
  image_filename: string | null;
}

/**
 * Represents grouped content with multiple columns
 */
interface GroupedContent {
  id_contents: number;
  order: number;
  columns: ContentColumn[];
}

/**
 * Represents content organized by page number
 */
interface PageContent {
  page: number;
  contents: GroupedContent[];
}

/**
 * CONTENT STORE SERVICE - Pure State Management for Page Content
 *
 * This store service manages content state using Angular Signals.
 * It is a pure state management service with NO side effects or API calls.
 *
 * RULES:
 * - NEVER call APIs directly
 * - Only manage state and expose signals
 * - Called EXCLUSIVELY by the facade service
 *
 * @remarks
 * This service provides content management with automatic grouping by pages.
 * Content is organized hierarchically: Page -> Content Blocks -> Columns,
 * where each content block can contain multiple columns with titles, text, and images.
 */
@Injectable({
  providedIn: 'root'
})
export class ContentStore {
  // ===== PRIVATE STATE =====
  /**
   * Private writable signal containing the array of all content data
   */
  private readonly _contents = signal<ContentData[]>([]);

  /**
   * Private writable signal for loading state
   */
  private readonly _loading = signal(false);

  /**
   * Private writable signal for error messages
   */
  private readonly _error = signal<string | null>(null);

  // ===== PUBLIC READ-ONLY SIGNALS =====
  /**
   * Read-only signal exposing the contents array
   */
  readonly contents = this._contents.asReadonly();

  /**
   * Read-only signal exposing the loading state
   */
  readonly loading = this._loading.asReadonly();

  /**
   * Read-only signal exposing error messages
   */
  readonly error = this._error.asReadonly();

  // ===== COMPUTED SIGNALS =====
  /**
   * Computed signal that organizes content data into a hierarchical structure by pages
   * Groups content by page number, then by content ID, then organizes columns
   * @returns Array of page objects, each containing sorted content blocks with columns
   */
  readonly contentsByPages = computed(() => {
    const contents = this._contents();
    if (!contents || contents.length === 0) return [];
    return this.groupContentsByPage(contents);
  });

  // ===== STATE MUTATIONS =====
  /**
   * Sets the contents array and clears any existing errors
   * @param contents - Array of content data to store
   */
  setContents(contents: ContentData[]): void {
    this._contents.set(contents);
    this._error.set(null);
  }

  /**
   * Sets the loading state
   * @param loading - Boolean indicating if an operation is in progress
   */
  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  /**
   * Sets an error message
   * @param error - The error message to set, or null to clear errors
   */
  setError(error: string | null): void {
    this._error.set(error);
  }

  /**
   * Clears all store data and resets to initial state
   */
  clearStore(): void {
    this._contents.set([]);
    this._loading.set(false);
    this._error.set(null);
  }

  // ===== PRIVATE HELPER METHODS =====
  /**
   * Groups content data by page, then by content ID, organizing columns within each content block
   * This private method transforms flat content data into a hierarchical structure
   * @param contents - Raw array of content data
   * @returns Structured array of pages with nested content blocks and columns
   */
  private groupContentsByPage(contents: ContentData[]): PageContent[] {
    const groupedByPage = contents.reduce((acc, item) => {
      if (!acc[item.page]) acc[item.page] = [];
      acc[item.page].push(item);
      return acc;
    }, {} as Record<number, ContentData[]>);

    const result: PageContent[] = Object.entries(groupedByPage).map(([page, pageContents]) => {
      const contentsByIdContent = pageContents.reduce((acc, item) => {
        if (!acc[item.id_contents]) {
          acc[item.id_contents] = {
            id_contents: item.id_contents,
            order: item.order,
            columns: []
          };
        }

        acc[item.id_contents].columns.push({
          position: item.position!,
          id_column: item.id_column,
          id_title: item.id_title,
          title_text: item.title_text,
          id_text: item.id_text,
          text_content: item.text_content,
          id_image: item.id_image,
          image_filename: item.image_filename
        });

        return acc;
      }, {} as Record<number, GroupedContent>);

      const contentsArray = Object.values(contentsByIdContent).sort((a, b) => a.order - b.order);

      return {
        page: Number(page),
        contents: contentsArray
      };
    }).sort((a, b) => a.page - b.page);

    return result;
  }
}

