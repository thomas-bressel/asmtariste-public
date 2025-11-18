export interface TagData {
  id_tags: string;
  color: string;
  background_color: string;
  border_color: string;
  label: string;
  is_display: boolean;
}

export type TagDataResponse = TagData[];