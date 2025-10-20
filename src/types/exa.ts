export interface ExaSearchResult {
  id: string;
  title: string;
  url: string;
  publishedDate?: string;
  author?: string;
  score: number;
  text?: string;
  image?: string;
}

export interface ExaSearchResponse {
  requestId: string;
  resolvedSearchType?: string;
  results: ExaSearchResult[];
  searchTime: number;
  costDollars: {
    total: number;
    search: {
      neural: number;
    };
    contents?: {
      text: number;
    };
  };
}

export interface ExaSimilarResponse {
  requestId: string;
  results: ExaSearchResult[];
  costDollars: {
    total: number;
    search: {
      neural: number;
    };
  };
  searchTime: number;
}

export interface SearchParams {
  query: string;
  numResults?: number;
  includeDomains?: string[];
  excludeDomains?: string[];
  startCrawlDate?: string;
  endCrawlDate?: string;
  startPublishedDate?: string;
  endPublishedDate?: string;
  useAutoprompt?: boolean;
  type?: "neural" | "keyword";
  category?: string;
  includeText?: boolean;
  textLength?: number;
  page?: number;
}

export interface SimilarParams {
  url: string;
  numResults?: number;
  includeDomains?: string[];
  excludeDomains?: string[];
  excludeText?: string[];
  startCrawlDate?: string;
  endCrawlDate?: string;
  startPublishedDate?: string;
  endPublishedDate?: string;
  category?: string;
  excludeSameDomain?: boolean;
  page?: number;
}

export interface PaginatedNeuralParams {
  query: string;
  includeDomains?: string[];
  excludeDomains?: string[];
  startCrawlDate?: string;
  endCrawlDate?: string;
  startPublishedDate?: string;
  endPublishedDate?: string;
  useAutoprompt?: boolean;
  type?: "neural" | "keyword";
  category?: string;
  includeText?: boolean;
  textLength?: number;
}

export interface PaginatedSimilarParams {
  url: string;
  includeDomains?: string[];
  excludeDomains?: string[];
  excludeText?: string[];
  startCrawlDate?: string;
  endCrawlDate?: string;
  startPublishedDate?: string;
  endPublishedDate?: string;
  type?: "similar";
  category?: string;
  excludeSameDomain?: boolean;
}

export interface PaginationMetadata {
  currentPage: number;
  totalResults: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedExaSearchResponse extends ExaSearchResponse {
  pagination: PaginationMetadata;
}

export interface PaginatedExaSimilarResponse extends ExaSimilarResponse {
  pagination: PaginationMetadata;
}
