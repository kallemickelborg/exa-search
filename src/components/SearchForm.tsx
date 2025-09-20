import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Link, Sparkles, Clock, DollarSign } from "lucide-react";
import type {
  PaginatedSearchParams,
  PaginatedSimilarParams,
} from "@/types/exa";

interface SearchFormProps {
  onSearch: (params: PaginatedSearchParams) => void;
  onFindSimilar: (params: PaginatedSimilarParams) => void;
  isLoading: boolean;
  activeQuery?: any;
  results?: any[];
  totalResults?: number;
  currentPage?: number;
  pagination?: any;
  searchType?: "search" | "similar";
  compact?: boolean;
}

export function SearchForm({
  onSearch,
  onFindSimilar,
  isLoading,
  activeQuery,
  results,
  totalResults,
  currentPage,
  pagination,
  searchType,
  compact = false,
}: SearchFormProps) {
  const [inputValue, setInputValue] = useState("");
  const [searchMode, setSearchMode] = useState<"search" | "similar">("search");
  const includeText = true;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (searchMode === "search") {
      onSearch({
        query: inputValue,
        includeText,
        textLength: 1000,
        type: "neural",
      });
    } else {
      onFindSimilar({
        url: inputValue,
      });
    }
  };

  return (
    <div className={compact ? "w-full" : "w-full max-w-4xl mx-auto"}>
      {!compact && (
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Exa Search Wrapper
          </h1>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Canvas-style search area */}
        <div className="relative">
          <div className="border border-border rounded-2xl bg-background shadow-sm hover:shadow-md transition-all duration-200 p-4 focus-within:shadow-lg focus-within:border-primary/50">
            <div className="flex items-start gap-4">
              {/* Tool icons on the left */}
              <div className="flex flex-col gap-2 pr-3 border-r border-border/50 h-full justify-between h-fill">
                <button
                  type="button"
                  onClick={() => setSearchMode("search")}
                  className={`p-2 rounded-lg transition-colors ${
                    searchMode === "search"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  title="Neural Search"
                >
                  <Search className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSearchMode("similar")}
                  className={`p-2 rounded-lg transition-colors ${
                    searchMode === "similar"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  title="Find Similar Pages"
                >
                  <Link className="h-4 w-4" />
                </button>
              </div>

              {/* Text area - the main canvas */}
              <div className="flex-1 relative">
                <textarea
                  placeholder={
                    searchMode === "search"
                      ? "Ask anything or search the web..."
                      : "Enter URL to find similar pages..."
                  }
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground resize-none min-h-[80px] py-2"
                  rows={compact ? 2 : 4}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      handleSubmit(e);
                    }
                  }}
                />
              </div>

              {/* Action buttons on the right */}
              <div className="h-fill flex flex-col gap-2 pl-3 border-l border-border/50">
                <Button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="h-fill rounded-lg px-4 py-2"
                  size="sm"
                >
                  {isLoading ? (
                    <Sparkles className="h-4 w-4 animate-spin" />
                  ) : searchMode === "search" ? (
                    "Search"
                  ) : (
                    "Find Similar"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Info and shortcuts */}
        {activeQuery?.data && results && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{activeQuery.data.searchTime.toFixed(0)}ms</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>${activeQuery.data.costDollars.total.toFixed(4)}</span>
              </div>
              <Badge variant="secondary">
                {results.length} of {totalResults || 0} result
                {(totalResults || 0) !== 1 ? "s" : ""} (Page {currentPage || 1}
                {pagination?.totalPages ? ` of ${pagination.totalPages}` : ""})
              </Badge>
              {searchType === "search" &&
                activeQuery.data &&
                "resolvedSearchType" in activeQuery.data && (
                  <Badge variant="outline">
                    {(activeQuery.data as any).resolvedSearchType}
                  </Badge>
                )}
            </div>
            {!compact && (
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-muted rounded text-xs">⌘</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd>
                <span className="ml-1">to submit</span>
              </div>
            )}
          </div>
        )}
        {!activeQuery?.data && !compact && (
          <div className="flex items-center justify-end text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-muted rounded text-xs">⌘</kbd>
              <span>+</span>
              <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd>
              <span className="ml-1">to submit</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
