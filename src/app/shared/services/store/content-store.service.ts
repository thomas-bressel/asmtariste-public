import { Injectable, signal, computed } from '@angular/core';
import { ContentData } from '@models/content.model';

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

interface GroupedContent {
  id_contents: number;
  order: number;
  columns: ContentColumn[];
}

interface PageContent {
  page: number;
  contents: GroupedContent[];
}

@Injectable({
  providedIn: 'root'
})
export class ContentStore {
  private readonly _contents = signal<ContentData[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly contents = this._contents.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly contentsByPages = computed(() => {
    const contents = this._contents();
    if (!contents || contents.length === 0) return [];
    return this.groupContentsByPage(contents);
  });

  setContents(contents: ContentData[]): void {
    this._contents.set(contents);
    this._error.set(null);
  }

  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  setError(error: string | null): void {
    this._error.set(error);
  }

  clearStore(): void {
    this._contents.set([]);
    this._loading.set(false);
    this._error.set(null);
  }

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

