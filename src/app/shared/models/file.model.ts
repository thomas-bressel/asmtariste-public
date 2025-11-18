export interface FileLabel {
  id_label: number;
  name: string;
}

export interface FileData {
  id_files: number;
  name: string;
  is_display: number;
  level_required: number;
  label: FileLabel;
}

export type FileDataResponse = FileData[];