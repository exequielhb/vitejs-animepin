export interface Image {
  id: string;
  url: string;
  title: string;
  category?: string;
  file?: File;
  userId?: string;
}