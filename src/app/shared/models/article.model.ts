import { TagData } from "./tag.model";
import { Author } from "./author.model";

export interface ArticleData {
  id_articles: number;
  title: string;
  slug: string;
  description: string;
  category_name: string;
  creation_date: string;
  update_date: string;
  cover: string;
  is_display: boolean;
  id_categories: number;
  id_author: number;
  uuid_user: string;
  tags?: TagData[];
  author: Author[];
  author_nickname?: string;
  }
  
 export interface ArticleDataResponse {
    data: ArticleData[];
  }
