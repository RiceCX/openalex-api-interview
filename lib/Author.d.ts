export interface Author {
  id: string;
  orcid: string;
  display_name: string;
  display_name_alternatives: string[];
  works_count: number;
  cited_by_count: number;
  ids: AuthorIds;
  last_known_institution: {
    id: string;
    ror: string;
    display_name: string;
    country_code: string;
    type: string;
  };
  x_concepts: Concept[];
  counts_by_year: WorkCounts[];
}

export interface WorkCounts {
  year: number;
  works_count: number;
  cited_by_count: number;
}

export interface Concept {
  id: string;
  wikidata?: string;
  display_name: string;
  level: number;
  score: number;
}

export interface AuthorIds {
  openalex: string;
  orcid: string;
  mag?: string;
  twitter?: string;
  wikipedia?: string;
  scopus?: string;
}
