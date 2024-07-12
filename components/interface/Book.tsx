
export interface Book {
    title: string;
    author_name: string[];
    publish_date: string[];
    image: string;
    ratings_average?: number;
    ratings_count?: number;
    edition_key?: string[];
    cover_edition_key?: string;
    cover_i?: string;
    first_sentence: string[];
    subject: string[];
    publisher: string[];
    language: string[];
    isbn: string[];
    format: string[];
    key: string;
    description?: string;
  
  }