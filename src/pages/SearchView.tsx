import { Pagination } from "@/components/Pagination";
import { ResultCard } from "@/components/ResultCard";
import { SearchForm } from "@/components/SearchForm";
import { BaseCard, BaseCardContent } from "@/components/cards/BaseCard";
import {
  clearResultCache,
  findSimilarPaginated,
  searchExaPaginated,
} from "@/lib/exa-api";
import type {
  PaginatedNeuralParams,
  PaginatedSimilarParams,
} from "@/types/exa";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function SearchView() {
  const [searchParams, setSearchParams] =
    useState<PaginatedNeuralParams | null>(null);
  const [similarParams, setSimilarParams] =
    useState<PaginatedSimilarParams | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchType, setSearchType] = useState<"search" | "similar">("search");
  const resultsPerPage = 10;

  const searchQuery = useQuery({
    queryKey: ["search", searchParams, currentPage],
    queryFn: () => searchExaPaginated(searchParams!, currentPage),
    enabled: !!searchParams && searchType === "search",
  });

  const similarQuery = useQuery({
    queryKey: ["similar", similarParams, currentPage],
    queryFn: () => findSimilarPaginated(similarParams!, currentPage),
    enabled: !!similarParams && searchType === "similar",
  });

  const activeQuery = searchType === "search" ? searchQuery : similarQuery;
  const results = activeQuery.data?.results || [];
  const pagination = activeQuery.data?.pagination;

  // Use pagination metadata if available, otherwise fallback to simple logic
  const hasNextPage =
    pagination?.hasNextPage ?? results.length === resultsPerPage;
  const totalResults = pagination?.totalResults ?? results.length;

  const handleSearch = (params: PaginatedNeuralParams) => {
    clearResultCache(); // Clear cache for new search
    setSearchParams(params);
    setSimilarParams(null);
    setSearchType("search");
    setCurrentPage(1);
  };

  const handleFindSimilar = (params: PaginatedSimilarParams) => {
    clearResultCache(); // Clear cache for new search
    setSimilarParams(params);
    setSearchParams(null);
    setSearchType("similar");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasSearched = !!(searchParams || similarParams);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 space-y-8">
        {!hasSearched ? (
          // Initial homepage layout - centered search
          <div className="min-h-screen flex flex-col items-center justify-center">
            <SearchForm
              onNeural={handleSearch}
              onSimilar={handleFindSimilar}
              isLoading={activeQuery.isLoading}
            />
          </div>
        ) : (
          // Search results layout - compact search at top
          <div className="py-4 space-y-6">
            <div className="border-b border-border pb-4 w-full max-w-3xl mx-auto">
              <SearchForm
                onNeural={handleSearch}
                onSimilar={handleFindSimilar}
                isLoading={activeQuery.isLoading}
                activeQuery={activeQuery}
                results={results}
                totalResults={totalResults}
                currentPage={currentPage}
                pagination={pagination}
                searchType={searchType}
              />
            </div>

            {activeQuery.error && (
              <BaseCard className="border-destructive">
                <BaseCardContent className="pt-6">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">Error</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {activeQuery.error instanceof Error
                      ? activeQuery.error.message
                      : "An error occurred"}
                  </p>
                </BaseCardContent>
              </BaseCard>
            )}

            {activeQuery.data && (
              <div className="space-y-6">
                {results.length > 0 ? (
                  <>
                    <div className="grid gap-6 grid-cols-1 max-w-3xl mx-auto">
                      {results.map((result, index) => (
                        <ResultCard
                          key={result.id}
                          result={result}
                          index={index}
                        />
                      ))}
                    </div>

                    {(currentPage > 1 || hasNextPage) && (
                      <div className="flex justify-center">
                        <Pagination
                          currentPage={currentPage}
                          hasNextPage={hasNextPage}
                          onPageChange={handlePageChange}
                          disabled={activeQuery.isLoading}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <BaseCard>
                    <BaseCardContent className="pt-6 text-center">
                      <p className="text-muted-foreground">No results found.</p>
                    </BaseCardContent>
                  </BaseCard>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <ThemeToggle />
    </div>
  );
}
