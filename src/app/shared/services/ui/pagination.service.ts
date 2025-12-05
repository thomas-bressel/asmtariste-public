// Angular imports
import { Injectable, signal, computed } from '@angular/core';

/**
 * UI Service for managing pagination state and calculations.
 *
 * This service provides a centralized state management solution for pagination across the application.
 * It uses Angular signals for reactive state management and computed values for derived pagination data.
 * The service handles all pagination logic including page navigation, range calculations, and
 * pagination UI state (disabled buttons, visible page numbers, etc.).
 *
 * Can be injected into any component that requires pagination functionality.
 *
 * @example
 * constructor(private paginationService: PaginationService) {}
 *
 * ngOnInit() {
 *   this.paginationService.initialize(100, 10); // 100 items, 10 per page
 * }
 */
@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  
  // Private signals for state management
  private readonly _currentPage = signal<number>(1);
  private readonly _totalItems = signal<number>(0);
  private readonly _itemsPerPage = signal<number>(1);
  private readonly _maxVisiblePages = signal<number>(5);
  
  /**
   * Public readonly signal for the current active page number.
   * @readonly
   */
  readonly currentPage = this._currentPage.asReadonly();

  /**
   * Public readonly signal for the total number of items in the dataset.
   * @readonly
   */
  readonly totalItems = this._totalItems.asReadonly();

  /**
   * Public readonly signal for the number of items to display per page.
   * @readonly
   */
  readonly itemsPerPage = this._itemsPerPage.asReadonly();

  /**
   * Public readonly signal for the maximum number of page numbers to show in the pagination UI.
   * @readonly
   */
  readonly maxVisiblePages = this._maxVisiblePages.asReadonly();
  
  /**
   * Computed signal that calculates the total number of pages based on total items and items per page.
   * @returns The total number of pages (rounded up)
   * @readonly
   */
  readonly totalPages = computed(() => {
    const total = this._totalItems();
    const perPage = this._itemsPerPage();
    return Math.ceil(total / perPage);
  });
  
  /**
   * Computed signal that determines if the "Previous" button should be disabled.
   * Returns true when the current page is the first page.
   * @returns True if navigation to previous page is not possible
   * @readonly
   */
  readonly isPreviousDisabled = computed(() => {
    return this._currentPage() <= 1;
  });
  
  /**
   * Computed signal that determines if the "Next" button should be disabled.
   * Returns true when the current page is the last page.
   * @returns True if navigation to next page is not possible
   * @readonly
   */
  readonly isNextDisabled = computed(() => {
    return this._currentPage() >= this.totalPages();
  });
  
  /**
   * Computed signal that determines if pagination controls should be displayed.
   * Returns true when there is more than one page.
   * @returns True if pagination UI should be shown
   * @readonly
   */
  readonly showPagination = computed(() => {
    return this.totalPages() > 1;
  });
  
  /**
   * Computed signal that generates an array of page numbers and ellipsis indicators to display in the pagination UI.
   * Implements smart pagination that shows a subset of pages with ellipsis (...) when there are many pages.
   * The algorithm ensures the current page is always visible and shows surrounding pages for context.
   * @returns Array of pagination items, each with type ('page' or 'dots'), optional value (page number), and active state
   * @readonly
   */
  readonly paginationNumbers = computed(() => {
    const current = this._currentPage();
    const total = this.totalPages();
    const maxVisible = this._maxVisiblePages();
    
    if (total === 0) return [];
    
    const pages: Array<{ type: 'page' | 'dots', value?: number, active?: boolean }> = [];
    
    if (total <= maxVisible) {
      // Show all pages if total is less than or equal to maxVisible
      for (let i = 1; i <= total; i++) {
        pages.push({ 
          type: 'page', 
          value: i, 
          active: i === current 
        });
      }
    } else {
      // Complex pagination logic for more pages
      let startPage: number;
      let endPage: number;
      
      const halfVisible = Math.floor(maxVisible / 2);
      
      if (current <= halfVisible + 1) {
        // Near the beginning
        startPage = 1;
        endPage = maxVisible;
      } else if (current >= total - halfVisible) {
        // Near the end
        startPage = total - maxVisible + 1;
        endPage = total;
      } else {
        // In the middle
        startPage = current - halfVisible;
        endPage = current + halfVisible;
      }
      
      // Add dots at the beginning if needed
      if (startPage > 1) {
        pages.push({ type: 'dots' });
      }
      
      // Add page numbers
      for (let i = startPage; i <= endPage; i++) {
        pages.push({ 
          type: 'page', 
          value: i, 
          active: i === current 
        });
      }
      
      // Add dots at the end if needed
      if (endPage < total) {
        pages.push({ type: 'dots' });
      }
    }
    
    return pages;
  });
  
  /**
   * Computed signal that provides information about the current page range and item counts.
   * Useful for displaying "Showing X to Y of Z items" type information.
   * @returns Object containing start index, end index, total items, current page, and total pages
   * @readonly
   */
  readonly pageRangeInfo = computed(() => {
    const current = this._currentPage();
    const perPage = this._itemsPerPage();
    const total = this._totalItems();
    
    const start = (current - 1) * perPage + 1;
    const end = Math.min(current * perPage, total);
    
    return {
      start,
      end,
      total,
      current,
      totalPages: this.totalPages()
    };
  });
  
  /**
   * Initializes the pagination service with the required configuration.
   * This should be called when setting up pagination for a dataset.
   * @param totalItems - The total number of items in the dataset
   * @param itemsPerPage - The number of items to display per page (defaults to 1)
   * @param startPage - The initial page to display (defaults to 1)
   */
  initialize(totalItems: number, itemsPerPage: number = 1, startPage: number = 1): void {
    this._totalItems.set(totalItems);
    this._itemsPerPage.set(itemsPerPage);
    this._currentPage.set(startPage);
  }
  
  /**
   * Updates the total number of items in the dataset.
   * Automatically resets to page 1 if the current page becomes out of bounds.
   * @param total - The new total number of items
   */
  setTotalItems(total: number): void {
    this._totalItems.set(total);
    // Reset to page 1 if current page is out of bounds
    if (this._currentPage() > this.totalPages()) {
      this._currentPage.set(1);
    }
  }
  
  /**
   * Updates the number of items to display per page.
   * Automatically resets to page 1 when changing this value.
   * @param perPage - The new number of items per page
   */
  setItemsPerPage(perPage: number): void {
    this._itemsPerPage.set(perPage);
    // Reset to page 1 when changing items per page
    this._currentPage.set(1);
  }
  
  /**
   * Updates the maximum number of page numbers to show in the pagination UI.
   * This affects how many page numbers are visible before ellipsis (...) are shown.
   * @param max - The maximum number of visible page numbers
   */
  setMaxVisiblePages(max: number): void {
    this._maxVisiblePages.set(max);
  }
  
  /**
   * Navigates to a specific page number.
   * Validates that the page number is within valid bounds before navigation.
   * @param pageNumber - The page number to navigate to
   * @returns True if navigation was successful, false if the page number is out of bounds
   */
  goToPage(pageNumber: number): boolean {
    if (pageNumber < 1 || pageNumber > this.totalPages()) {
      return false;
    }
    
    this._currentPage.set(pageNumber);
    return true;
  }
  
  /**
   * Navigates to the first page (page 1).
   */
  goToFirst(): void {
    this.goToPage(1);
  }
  
  /**
   * Navigates to the last page.
   */
  goToLast(): void {
    this.goToPage(this.totalPages());
  }
  
  /**
   * Navigates to the previous page.
   * @returns True if navigation was successful, false if already on the first page
   */
  previousPage(): boolean {
    const current = this._currentPage();
    if (current > 1) {
      return this.goToPage(current - 1);
    }
    return false;
  }
  
  /**
   * Navigates to the next page.
   * @returns True if navigation was successful, false if already on the last page
   */
  nextPage(): boolean {
    const current = this._currentPage();
    if (current < this.totalPages()) {
      return this.goToPage(current + 1);
    }
    return false;
  }
  
  /**
   * Resets the pagination to its initial state.
   * Sets current page to 1 and total items to 0.
   */
  reset(): void {
    this._currentPage.set(1);
    this._totalItems.set(0);
  }
  
  /**
   * Returns the current pagination state as a plain object.
   * Useful for debugging or passing state to external components.
   * @returns Object containing current page, total pages, total items, and items per page
   */
  getCurrentState() {
    return {
      currentPage: this._currentPage(),
      totalPages: this.totalPages(),
      totalItems: this._totalItems(),
      itemsPerPage: this._itemsPerPage()
    };
  }
}