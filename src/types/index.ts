export interface Nominee {
  id: string;
  name: string;
  organization: string;
  photo: string;
  aiHint?: string | null;
  category_id?: string;
}

export interface Category {
  id: string;
  title: string;
  nominees: Nominee[];
  tbd?: boolean;
}
