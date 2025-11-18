// Angular imports
import { Injectable, signal, computed } from '@angular/core';

/**
 * Service for managing pagination state and logic
 * Can be used across different components that need pagination
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
  
  // Public readonly signals
  readonly currentPage = this._currentPage.asReadonly();
  readonly totalItems = this._totalItems.asReadonly();
  readonly itemsPerPage = this._itemsPerPage.asReadonly();
  readonly maxVisiblePages = this._maxVisiblePages.asReadonly();
  
  /**
   * Computed: total number of pages
   */
  readonly totalPages = computed(() => {
    const total = this._totalItems();
    const perPage = this._itemsPerPage();
    return Math.ceil(total / perPage);
  });
  
  /**
   * Computed: check if previous button should be disabled
   */
  readonly isPreviousDisabled = computed(() => {
    return this._currentPage() <= 1;
  });
  
  /**
   * Computed: check if next button should be disabled
   */
  readonly isNextDisabled = computed(() => {
    return this._currentPage() >= this.totalPages();
  });
  
  /**
   * Computed: check if pagination is needed
   */
  readonly showPagination = computed(() => {
    return this.totalPages() > 1;
  });
  
  /**
   * Computed: get page numbers to display
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
   * Computed: get current page range info
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
   * Initialize pagination with total items
   */
  initialize(totalItems: number, itemsPerPage: number = 1, startPage: number = 1): void {
    this._totalItems.set(totalItems);
    this._itemsPerPage.set(itemsPerPage);
    this._currentPage.set(startPage);
  }
  
  /**
   * Update total items
   */
  setTotalItems(total: number): void {
    this._totalItems.set(total);
    // Reset to page 1 if current page is out of bounds
    if (this._currentPage() > this.totalPages()) {
      this._currentPage.set(1);
    }
  }
  
  /**
   * Update items per page
   */
  setItemsPerPage(perPage: number): void {
    this._itemsPerPage.set(perPage);
    // Reset to page 1 when changing items per page
    this._currentPage.set(1);
  }
  
  /**
   * Update max visible pages in pagination
   */
  setMaxVisiblePages(max: number): void {
    this._maxVisiblePages.set(max);
  }
  
  /**
   * Navigate to specific page
   */
  goToPage(pageNumber: number): boolean {
    if (pageNumber < 1 || pageNumber > this.totalPages()) {
      return false;
    }
    
    this._currentPage.set(pageNumber);
    return true;
  }
  
  /**
   * Navigate to first page
   */
  goToFirst(): void {
    this.goToPage(1);
  }
  
  /**
   * Navigate to last page
   */
  goToLast(): void {
    this.goToPage(this.totalPages());
  }
  
  /**
   * Navigate to previous page
   */
  previousPage(): boolean {
    const current = this._currentPage();
    if (current > 1) {
      return this.goToPage(current - 1);
    }
    return false;
  }
  
  /**
   * Navigate to next page
   */
  nextPage(): boolean {
    const current = this._currentPage();
    if (current < this.totalPages()) {
      return this.goToPage(current + 1);
    }
    return false;
  }
  
  /**
   * Reset pagination to initial state
   */
  reset(): void {
    this._currentPage.set(1);
    this._totalItems.set(0);
  }
  
  /**
   * Get current state as object
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