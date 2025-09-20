import type {
  ExaSearchResponse,
  ExaSimilarResponse,
  SearchParams,
  SimilarParams,
  PaginatedSearchParams,
  PaginatedSimilarParams,
  PaginatedExaSearchResponse,
  PaginatedExaSimilarResponse
} from '@/types/exa';

const EXA_API_BASE = 'https://api.exa.ai';
const RESULTS_PER_PAGE = 10;
const MAX_RESULTS_TO_FETCH = 30; // Fetch 30 results upfront for 3 pages of pagination

// You'll need to set your API key as an environment variable
const getApiKey = () => {
  const apiKey = import.meta.env.VITE_EXA_API_KEY;
  if (!apiKey) {
    throw new Error('EXA_API_KEY environment variable is not set');
  }
  return apiKey;
};

export const searchExa = async (params: SearchParams): Promise<ExaSearchResponse> => {
  const apiKey = getApiKey();
  
  const requestBody = {
    query: params.query,
    numResults: params.numResults || 10,
    includeDomains: params.includeDomains,
    excludeDomains: params.excludeDomains,
    startCrawlDate: params.startCrawlDate,
    endCrawlDate: params.endCrawlDate,
    startPublishedDate: params.startPublishedDate,
    endPublishedDate: params.endPublishedDate,
    useAutoprompt: params.useAutoprompt,
    type: params.type || 'neural',
    category: params.category,
    contents: params.includeText ? {
      text: {
        maxCharacters: params.textLength || 1000,
        includeHtmlTags: false
      }
    } : undefined
  };

  const response = await fetch(`${EXA_API_BASE}/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Exa API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json();
};

export const findSimilar = async (params: SimilarParams): Promise<ExaSimilarResponse> => {
  const apiKey = getApiKey();

  const requestBody = {
    url: params.url,
    numResults: params.numResults || 10,
    includeDomains: params.includeDomains,
    excludeDomains: params.excludeDomains,
    startCrawlDate: params.startCrawlDate,
    endCrawlDate: params.endCrawlDate,
    startPublishedDate: params.startPublishedDate,
    endPublishedDate: params.endPublishedDate,
    category: params.category,
  };

  const response = await fetch(`${EXA_API_BASE}/findSimilar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Exa API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json();
};

// Cache for storing full result sets
const resultCache = new Map<string, ExaSearchResponse | ExaSimilarResponse>();

// Generate cache key for search parameters
const generateCacheKey = (params: PaginatedSearchParams | PaginatedSimilarParams, type: 'search' | 'similar'): string => {
  return `${type}-${JSON.stringify(params)}`;
};

// Paginated search function
export const searchExaPaginated = async (params: PaginatedSearchParams, page: number = 1): Promise<PaginatedExaSearchResponse> => {
  const cacheKey = generateCacheKey(params, 'search');

  // Check if we have cached results
  let fullResults = resultCache.get(cacheKey) as ExaSearchResponse;

  if (!fullResults) {
    // Fetch full result set
    const searchParams: SearchParams = {
      ...params,
      numResults: MAX_RESULTS_TO_FETCH,
    };

    fullResults = await searchExa(searchParams);
    resultCache.set(cacheKey, fullResults);
  }

  // Calculate pagination
  const startIndex = (page - 1) * RESULTS_PER_PAGE;
  const endIndex = startIndex + RESULTS_PER_PAGE;
  const paginatedResults = fullResults.results.slice(startIndex, endIndex);

  // Return paginated response with additional metadata
  return {
    ...fullResults,
    results: paginatedResults,
    // Add pagination metadata
    pagination: {
      currentPage: page,
      totalResults: fullResults.results.length,
      totalPages: Math.ceil(fullResults.results.length / RESULTS_PER_PAGE),
      hasNextPage: endIndex < fullResults.results.length,
      hasPrevPage: page > 1,
    },
  };
};

// Paginated similar search function
export const findSimilarPaginated = async (params: PaginatedSimilarParams, page: number = 1): Promise<PaginatedExaSimilarResponse> => {
  const cacheKey = generateCacheKey(params, 'similar');

  // Check if we have cached results
  let fullResults = resultCache.get(cacheKey) as ExaSimilarResponse;

  if (!fullResults) {
    // Fetch full result set
    const similarParams: SimilarParams = {
      ...params,
      numResults: MAX_RESULTS_TO_FETCH,
    };

    fullResults = await findSimilar(similarParams);
    resultCache.set(cacheKey, fullResults);
  }

  // Calculate pagination
  const startIndex = (page - 1) * RESULTS_PER_PAGE;
  const endIndex = startIndex + RESULTS_PER_PAGE;
  const paginatedResults = fullResults.results.slice(startIndex, endIndex);

  // Return paginated response with additional metadata
  return {
    ...fullResults,
    results: paginatedResults,
    // Add pagination metadata
    pagination: {
      currentPage: page,
      totalResults: fullResults.results.length,
      totalPages: Math.ceil(fullResults.results.length / RESULTS_PER_PAGE),
      hasNextPage: endIndex < fullResults.results.length,
      hasPrevPage: page > 1,
    },
  };
};

// Function to clear cache (useful for new searches)
export const clearResultCache = () => {
  resultCache.clear();
};
