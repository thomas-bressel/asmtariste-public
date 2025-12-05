// Angular imports
import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// Service imports
import { PaginationService } from '@services/ui/pagination.service';

import { Button } from '../button/button';

/**
 * Configuration interface for pagination component display and behavior
 */
interface PaginationConfig {
  /** Whether to show first and last page buttons */
  showFirstLast: boolean;
  /** Whether to show page information (e.g., "Page 1 of 10") */
  showPageInfo: boolean;
  /** Whether to show text labels on navigation buttons */
  showButtonText: boolean;
  /** Whether to always show pagination even with one page */
  alwaysShow: boolean;
  /** Whether to scroll to top when page changes */
  scrollToTop: boolean;
  /** Text for the previous button */
  previousButtonText: string;
  /** Text for the next button */
  nextButtonText: string;
  /** Aria label for the first page button */
  firstButtonLabel: string;
  /** Aria label for the last page button */
  lastButtonLabel: string;
  /** Aria label for the previous page button */
  previousButtonLabel: string;
  /** Aria label for the next page button */
  nextButtonLabel: string;
  /** Aria label for the pagination navigation */
  ariaLabel: string;
  /** Text to display for page ellipsis (dots) */
  dotsText: string;
}

/**
 * Initialization options interface for setting up pagination
 */
interface PaginationOptions {
  /** Total number of items to paginate */
  totalItems: number;
  /** Number of items to show per page (defaults to 1) */
  itemsPerPage?: number;
  /** Initial page number (defaults to 1) */
  currentPage?: number;
  /** Maximum number of visible page buttons (defaults to 5) */
  maxVisiblePages?: number;
  /** Whether to use the pagination service for state management (defaults to true) */
  useService?: boolean;
  /** Callback function invoked when page changes */
  onPageChange?: (page: number) => void;
  /** Partial configuration to override default settings */
  config?: Partial<PaginationConfig>;
}

/**
 * Angular standalone pagination component using signals only.
 *
 * This component provides a fully signal-based pagination solution optimized for Angular 19+ zoneless mode.
 * It supports both standalone operation and integration with PaginationService for shared state management.
 * Features include configurable navigation buttons, page number display with ellipsis, accessibility support,
 * and automatic scroll-to-top on page changes.
 *
 * @example
 * ```typescript
 * // In component
 * @ViewChild(PaginationComponent) pagination!: PaginationComponent;
 *
 * ngAfterViewInit() {
 *   this.pagination.initialize({
 *     totalItems: 100,
 *     itemsPerPage: 10,
 *     currentPage: 1,
 *     onPageChange: (page) => this.loadPage(page)
 *   });
 * }
 * ```
 */
@Component({
  selector: 'section[app-pagination]',
  standalone: true,
  imports: [CommonModule, Button],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss'
})
export class PaginationComponent {

  /** Injected pagination service for shared state management */
  private readonly paginationService = inject(PaginationService);

  /**
   * Internal configuration signal with default values including button labels and behavior settings.
   * Default language is French for user-facing text.
   */
  private readonly _config = signal<PaginationConfig>({
    showFirstLast: true,
    showPageInfo: true,
    showButtonText: true,
    alwaysShow: false,
    scrollToTop: true,
    previousButtonText: 'Précédent',
    nextButtonText: 'Suivant',
    firstButtonLabel: 'Première page',
    lastButtonLabel: 'Dernière page',
    previousButtonLabel: 'Page précédente',
    nextButtonLabel: 'Page suivante',
    ariaLabel: 'Pagination',
    dotsText: '...'
  });

  /** Internal signal storing the callback function to invoke when page changes */
  private readonly _onPageChange = signal<((page: number) => void) | null>(null);

  /** Public readonly configuration signal exposed to template */
  public readonly config = this._config.asReadonly();

  /** Internal signal tracking the current active page number */
  private readonly _currentPage = signal<number>(1);

  /** Internal signal storing the total number of items to paginate */
  private readonly _totalItems = signal<number>(0);

  /** Internal signal storing the number of items displayed per page */
  private readonly _itemsPerPage = signal<number>(1);

  /** Internal signal defining the maximum number of page buttons to display */
  private readonly _maxVisiblePages = signal<number>(5);

  /** Internal signal controlling whether to use PaginationService for state management */
  private readonly _useService = signal<boolean>(true);

  /** Public readonly signal exposing the current page number */
  public readonly currentPage = this._currentPage.asReadonly();

  /** Public readonly signal exposing the total items count */
  public readonly totalItems = this._totalItems.asReadonly();

  /** Public readonly signal exposing the items per page count */
  public readonly itemsPerPage = this._itemsPerPage.asReadonly();

  /** Public readonly signal indicating whether service-based state management is enabled */
  public readonly useService = this._useService.asReadonly();
  
  /**
   * Computed signal that calculates the total number of pages.
   * Divides total items by items per page, rounding up to include partial pages.
   * Delegates to PaginationService if service-based state management is enabled.
   *
   * @returns The total number of pages
   */
  public readonly totalPages = computed(() => {
    if (this._useService()) {
      return this.paginationService.totalPages();
    }
    return Math.ceil(this._totalItems() / this._itemsPerPage());
  });

  /**
   * Computed signal that determines whether the "previous" button should be disabled.
   * Returns true when on the first page (page 1).
   * Delegates to PaginationService if service-based state management is enabled.
   *
   * @returns True if previous navigation should be disabled
   */
  public readonly isPreviousDisabled = computed(() => {
    if (this._useService()) {
      return this.paginationService.isPreviousDisabled();
    }
    return this._currentPage() <= 1;
  });

  /**
   * Computed signal that determines whether the "next" button should be disabled.
   * Returns true when on the last page.
   * Delegates to PaginationService if service-based state management is enabled.
   *
   * @returns True if next navigation should be disabled
   */
  public readonly isNextDisabled = computed(() => {
    if (this._useService()) {
      return this.paginationService.isNextDisabled();
    }
    return this._currentPage() >= this.totalPages();
  });

  /**
   * Computed signal that determines whether pagination controls should be visible.
   * Returns true when there is more than one page of content.
   * Delegates to PaginationService if service-based state management is enabled.
   *
   * @returns True if pagination should be displayed
   */
  public readonly showPagination = computed(() => {
    if (this._useService()) {
      return this.paginationService.showPagination();
    }
    return this.totalPages() > 1;
  });

  /**
   * Computed signal that generates the array of page numbers and ellipsis to display.
   * Creates an intelligent pagination display with dots (...) when there are many pages.
   * Shows a maximum of `maxVisiblePages` page buttons with smart positioning around the current page.
   * Delegates to PaginationService if service-based state management is enabled.
   *
   * @returns Array of pagination elements containing page numbers or dots
   * @example
   * // For current page 5 of 20 with maxVisiblePages 5:
   * // Returns: [dots, 3, 4, 5, 6, 7, dots]
   */
  public readonly paginationNumbers = computed(() => {
    if (this._useService()) {
      return this.paginationService.paginationNumbers();
    }
    
    const current = this._currentPage();
    const total = this.totalPages();
    const maxVisible = this._maxVisiblePages();
    
    if (total === 0) return [];
    
    const pages: Array<{ type: 'page' | 'dots', value?: number, active?: boolean }> = [];
    
    if (total <= maxVisible) {
      for (let i = 1; i <= total; i++) {
        pages.push({ 
          type: 'page', 
          value: i, 
          active: i === current 
        });
      }
    } else {
      const halfVisible = Math.floor(maxVisible / 2);
      let startPage: number;
      let endPage: number;
      
      if (current <= halfVisible + 1) {
        startPage = 1;
        endPage = maxVisible;
      } else if (current >= total - halfVisible) {
        startPage = total - maxVisible + 1;
        endPage = total;
      } else {
        startPage = current - halfVisible;
        endPage = current + halfVisible;
      }
      
      if (startPage > 1) {
        pages.push({ type: 'dots' });
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push({ 
          type: 'page', 
          value: i, 
          active: i === current 
        });
      }
      
      if (endPage < total) {
        pages.push({ type: 'dots' });
      }
    }
    
    return pages;
  });
  
  /**
   * Initializes the pagination component with the provided configuration options.
   * This method should be called after component initialization to set up pagination state.
   * If useService is true, also initializes the PaginationService with the same settings.
   *
   * @param options - Configuration options for pagination setup
   * @param options.totalItems - Total number of items to paginate (required)
   * @param options.itemsPerPage - Number of items per page (defaults to 1)
   * @param options.currentPage - Initial page number (defaults to 1)
   * @param options.maxVisiblePages - Maximum page buttons to display (defaults to 5)
   * @param options.useService - Whether to use PaginationService (defaults to true)
   * @param options.onPageChange - Callback invoked on page change
   * @param options.config - Partial configuration to override defaults
   *
   * @example
   * ```typescript
   * this.pagination.initialize({
   *   totalItems: 100,
   *   itemsPerPage: 10,
   *   currentPage: 1,
   *   maxVisiblePages: 7,
   *   onPageChange: (page) => this.loadData(page)
   * });
   * ```
   */
  public initialize(options: PaginationOptions): void {
    this._totalItems.set(options.totalItems);
    this._itemsPerPage.set(options.itemsPerPage ?? 1);
    this._currentPage.set(options.currentPage ?? 1);
    this._maxVisiblePages.set(options.maxVisiblePages ?? 5);
    this._useService.set(options.useService ?? true);

        if (options.totalItems) {
        this._totalItems.set(options.totalItems);
    }
    
    if (options.onPageChange) {
      this._onPageChange.set(options.onPageChange);
    }
    
    if (options.config) {
      this._config.update(current => ({ ...current, ...options.config }));
    }
    
    if (this._useService()) {
      this.paginationService.initialize(
        this._totalItems(),
        options.itemsPerPage ?? this.itemsPerPage(),
        options.currentPage ?? this.currentPage()
      );
    }
  }
  
  /**
   * Updates the pagination configuration with new values.
   * Merges the provided configuration with the existing settings.
   *
   * @param config - Partial configuration object with properties to update
   *
   * @example
   * ```typescript
   * this.pagination.updateConfig({
   *   showFirstLast: false,
   *   previousButtonText: 'Previous',
   *   nextButtonText: 'Next'
   * });
   * ```
   */
  public updateConfig(config: Partial<PaginationConfig>): void {
    this._config.update(current => ({ ...current, ...config }));
  }

  /**
   * Sets or updates the callback function that will be invoked when the page changes.
   *
   * @param callback - Function to call when page changes, receives the new page number
   *
   * @example
   * ```typescript
   * this.pagination.setPageChangeCallback((page) => {
   *   // console.log(`Changed to page ${page}`);
   *   this.loadData(page);
   * });
   * ```
   */
  public setPageChangeCallback(callback: (page: number) => void): void {
    this._onPageChange.set(callback);
  }

  /**
   * Navigates to a specific page number.
   * Validates the page number is within valid range before navigating.
   * Triggers the page change callback and optional scroll-to-top behavior.
   *
   * @param page - The page number to navigate to (1-indexed)
   *
   * @example
   * ```typescript
   * this.pagination.goToPage(5);
   * ```
   */
  public goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    
    if (this._useService()) {
      if (this.paginationService.goToPage(page)) {
        this.handlePageChange(this.paginationService.currentPage());
      }
    } else {
      this._currentPage.set(page);
      this.handlePageChange(page);
    }
  }
  
  /**
   * Navigates to the previous page if not already on the first page.
   * Automatically determines current page from either service or component state.
   */
  public previousPage(): void {
    const current = this._useService()
      ? this.paginationService.currentPage()
      : this._currentPage();

    if (current > 1) {
      this.goToPage(current - 1);
    }
  }

  /**
   * Navigates to the next page if not already on the last page.
   * Automatically determines current page from either service or component state.
   */
  public nextPage(): void {
    const current = this._useService()
      ? this.paginationService.currentPage()
      : this._currentPage();

    if (current < this.totalPages()) {
      this.goToPage(current + 1);
    }
  }

  /**
   * Navigates to the first page (page 1).
   */
  public goToFirst(): void {
    this.goToPage(1);
  }

  /**
   * Navigates to the last page based on total pages calculated.
   */
  public goToLast(): void {
    this.goToPage(this.totalPages());
  }

  /**
   * Internal handler for page change events.
   * Executes the registered callback function if present and handles scroll-to-top behavior
   * based on configuration settings.
   *
   * @param page - The new page number that was navigated to
   */
  private handlePageChange(page: number): void {
    const callback = this._onPageChange();
    if (callback) {
      callback(page);
    }
    
    if (this._config().scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  
  /**
   * Updates the total number of items for pagination calculation.
   * This will trigger recalculation of total pages.
   * If using PaginationService, also updates the service state.
   *
   * @param total - The new total number of items
   *
   * @example
   * ```typescript
   * // After filtering items
   * this.pagination.updateTotalItems(filteredItems.length);
   * ```
   */
  public updateTotalItems(total: number): void {
    this._totalItems.set(total);
    if (this._useService()) {
      this.paginationService.setTotalItems(total);
    }
  }

  /**
   * Resets the pagination to its initial state (page 1).
   * If using PaginationService, also resets the service state.
   *
   * @example
   * ```typescript
   * // After applying new filters
   * this.pagination.reset();
   * ```
   */
  public reset(): void {
    this._currentPage.set(1);
    if (this._useService()) {
      this.paginationService.reset();
    }
  }
}