// Angular imports
import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// Service imports
import { PaginationService } from '@services/ui/pagination.service';

import { Button } from '../button/button';

// Define the configuration interface
interface PaginationConfig {
  showFirstLast: boolean;
  showPageInfo: boolean;
  showButtonText: boolean;
  alwaysShow: boolean;
  scrollToTop: boolean;
  previousButtonText: string;
  nextButtonText: string;
  firstButtonLabel: string;
  lastButtonLabel: string;
  previousButtonLabel: string;
  nextButtonLabel: string;
  ariaLabel: string;
  dotsText: string;
}

// Define initialization options interface
interface PaginationOptions {
  totalItems: number;
  itemsPerPage?: number;
  currentPage?: number;
  maxVisiblePages?: number;
  useService?: boolean;
  onPageChange?: (page: number) => void;
  config?: Partial<PaginationConfig>;
}

/**
 * Reusable pagination component using signals only
 * No @Input/@Output, fully signal-based for Angular 19+ zoneless
 */
@Component({
  selector: 'section[app-pagination]',
  standalone: true,
  imports: [CommonModule, Button],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss'
})
export class PaginationComponent {
  
  // Service injection
  private readonly paginationService = inject(PaginationService);
  
  // Configuration signal with default values
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
  
  // Page change callback signal
  private readonly _onPageChange = signal<((page: number) => void) | null>(null);
  
  // Public signals
  public readonly config = this._config.asReadonly();
  
  // Internal state signals
  private readonly _currentPage = signal<number>(1);
  private readonly _totalItems = signal<number>(0);
  private readonly _itemsPerPage = signal<number>(1);
  private readonly _maxVisiblePages = signal<number>(5);
  private readonly _useService = signal<boolean>(true);
  
  // Public readonly signals
  public readonly currentPage = this._currentPage.asReadonly();
  public readonly totalItems = this._totalItems.asReadonly();
  public readonly itemsPerPage = this._itemsPerPage.asReadonly();
  public readonly useService = this._useService.asReadonly();
  
  /**
   * Computed: total pages
   */
  public readonly totalPages = computed(() => {
    if (this._useService()) {
      return this.paginationService.totalPages();
    }
    return Math.ceil(this._totalItems() / this._itemsPerPage());
  });
  
  /**
   * Computed: is previous disabled
   */
  public readonly isPreviousDisabled = computed(() => {
    if (this._useService()) {
      return this.paginationService.isPreviousDisabled();
    }
    return this._currentPage() <= 1;
  });
  
  /**
   * Computed: is next disabled
   */
  public readonly isNextDisabled = computed(() => {
    if (this._useService()) {
      return this.paginationService.isNextDisabled();
    }
    return this._currentPage() >= this.totalPages();
  });
  
  /**
   * Computed: should show pagination
   */
  public readonly showPagination = computed(() => {
    if (this._useService()) {
      return this.paginationService.showPagination();
    }
    return this.totalPages() > 1;
  });
  
  /**
   * Computed: pagination numbers array
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
   * Initialize pagination with data
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
   * Update configuration
   */
  public updateConfig(config: Partial<PaginationConfig>): void {
    this._config.update(current => ({ ...current, ...config }));
  }
  
  /**
   * Set page change callback
   */
  public setPageChangeCallback(callback: (page: number) => void): void {
    this._onPageChange.set(callback);
  }
  
  /**
   * Navigate to specific page
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
   * Navigate to previous page
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
   * Navigate to next page
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
   * Navigate to first page
   */
  public goToFirst(): void {
    this.goToPage(1);
  }
  
  /**
   * Navigate to last page
   */
  public goToLast(): void {
    this.goToPage(this.totalPages());
  }
  
  /**
   * Handle page change event
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
   * Update total items
   */
  public updateTotalItems(total: number): void {
    this._totalItems.set(total);
    if (this._useService()) {
      this.paginationService.setTotalItems(total);
    }
  }
  
  /**
   * Reset pagination
   */
  public reset(): void {
    this._currentPage.set(1);
    if (this._useService()) {
      this.paginationService.reset();
    }
  }
}