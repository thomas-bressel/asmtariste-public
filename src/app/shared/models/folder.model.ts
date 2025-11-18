export interface FolderData {
  id_folder: number;
  title: string;
  description: string;
  link: string;
  icon: string;
  level_required: number;
  is_display: boolean;
}

export type FolderDataResponse = FolderData[];