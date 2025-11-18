export interface ContentData {
  // Structure information
  id_column: number;
  page: number;
  order: number;
  id_contents: number;
  position: number;
  
  // Title details
  id_title: number | null;
  title_text: string | null;
  
  // Text details
  id_text: number | null;
  text_content: string | null;
  
  // Image details
  id_image: number | null;
  image_filename: string | null;
}

export interface ContentDataResponse {
  data: ContentData;
}