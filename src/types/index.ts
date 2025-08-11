export interface Nominee {
  id: string;
  name: string;
  organization: string;
  photo: string;
  aiHint?: string;
}

export interface Category {
  id: string;
  title: string;
  nominees: Nominee[];
  tbd?: boolean;
}
