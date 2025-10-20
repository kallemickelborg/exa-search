import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Title } from "@/components/headers/Title";
import { BaseButton } from "@/components/buttons/BaseButton";
import { BaseBadge } from "@/components/badges/BaseBadge";
import {
  Search,
  Link,
  Sparkles,
  Clock,
  DollarSign,
  Settings,
} from "lucide-react";
import type {
  PaginatedNeuralParams,
  PaginatedSimilarParams,
} from "@/types/exa";

interface SearchFormProps {
  onNeural: (params: PaginatedNeuralParams) => void;
  onSimilar: (params: PaginatedSimilarParams) => void;
  isLoading: boolean;
  activeQuery?: any;
  results?: any[];
  totalResults?: number;
  currentPage?: number;
  pagination?: any;
  searchType?: "search" | "similar";
}

export function SearchForm({
  onNeural,
  onSimilar,
  isLoading,
  activeQuery,
  results,
  totalResults,
  currentPage,
  pagination,
  searchType,
}: SearchFormProps) {
  const [inputValue, setInputValue] = useState("");
  const [searchMode, setSearchMode] = useState<"search" | "similar">("search");
  const [excludeSameDomain, setExcludeSameDomain] = useState(true);
  const [includeDomains, setIncludeDomains] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<
    "all" | "7d" | "30d" | "3m" | "6m" | "ytd"
  >("all");
  const includeText = true;

  // Helper function to convert date range to start/end dates
  const getDateRangeParams = (range: string) => {
    const today = new Date();
    let startDate: Date | null = null;

    switch (range) {
      case "7d":
        startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "3m":
        startDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "6m":
        startDate = new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      case "ytd":
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
      default:
        return {};
    }

    return startDate
      ? {
          startPublishedDate: startDate.toISOString().split("T")[0],
          endPublishedDate: today.toISOString().split("T")[0],
        }
      : {};
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const dateParams = getDateRangeParams(dateRange);
    const domainsArray = includeDomains
      .split(",")
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    // Validate that includeDomains and excludeDomains are not used together
    if (domainsArray.length > 0) {
      console.warn("includeDomains is set. excludeDomains will be ignored.");
    }

    if (searchMode === "search") {
      onNeural({
        query: inputValue,
        includeText,
        textLength: 1000,
        type: "neural",
        includeDomains: domainsArray.length > 0 ? domainsArray : undefined,
        ...dateParams,
      });
    } else {
      onSimilar({
        url: inputValue,
        excludeSameDomain,
        type: "similar",
        includeDomains: domainsArray.length > 0 ? domainsArray : undefined,
        ...dateParams,
      });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {!activeQuery && !results && (
        <div className="text-center mb-8 flex flex-col items-center gap-4">
          <Title title="exa" />
          <h2 className="text-xl tracking-tight mb-2">
            {searchMode === "similar" ? "Find Similar Pages" : "Neural Search"}
          </h2>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Canvas-style search area */}
        <div className="relative">
          <div className="border border-border rounded-2xl bg-background shadow-sm hover:shadow-md transition-all duration-200 p-4 focus-within:shadow-lg focus-within:border-primary/50 flex flex-col gap-4">
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
                <motion.button
                  onClick={() => setSettingsOpen((prev) => !prev)}
                  className={`p-2 rounded-lg transition-colors ${
                    settingsOpen === true
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  animate={{ rotate: settingsOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <Settings className="h-4 w-4" />
                </motion.button>
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
                  rows={activeQuery || results ? 2 : 4}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      handleSubmit(e);
                    }
                  }}
                />
              </div>

              {/* Action buttons on the right */}
              <div className="h-fill flex flex-col gap-2 pl-3 border-l border-border/50">
                <BaseButton
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="h-fill rounded-lg px-4 py-2"
                  size="sm"
                >
                  {isLoading ? (
                    <Sparkles className="h-4 w-4 animate-spin" />
                  ) : (
                    "Search"
                  )}
                </BaseButton>
              </div>
            </div>
            {/* Filters */}
            <AnimatePresence>
              {settingsOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex flex-col gap-4 overflow-hidden"
                >
                  <div className="flex flex-row justify-between gap-4">
                    {/* Include domains filter */}
                    <div className="flex flex-col w-full gap-2">
                      <label
                        htmlFor="includeDomains"
                        className="text-sm font-medium text-foreground"
                      >
                        Include Domains
                      </label>
                      <input
                        id="includeDomains"
                        type="text"
                        placeholder="github.com, stackoverflow.com"
                        value={includeDomains}
                        onChange={(e) => setIncludeDomains(e.target.value)}
                        className="px-3 py-2 rounded border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    {/* Date range filter */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-foreground">
                        Date Range
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { value: "all", label: "All" },
                          { value: "7d", label: "7D" },
                          { value: "30d", label: "30D" },
                          { value: "3m", label: "3M" },
                          { value: "6m", label: "6M" },
                          { value: "ytd", label: "YTD" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setDateRange(
                                option.value as
                                  | "all"
                                  | "7d"
                                  | "30d"
                                  | "3m"
                                  | "6m"
                                  | "ytd"
                              );
                            }}
                            className={`px-3 py-1 rounded text-sm transition-colors ${
                              dateRange === option.value
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Similar search options */}
                    {searchMode === "similar" && (
                      <div className="flex flex-col gap-2 px-1">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="excludeSameDomain"
                            checked={excludeSameDomain}
                            onChange={(e) =>
                              setExcludeSameDomain(e.target.checked)
                            }
                            disabled={includeDomains.trim().length > 0}
                            className="w-4 h-4 rounded border-border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <label
                            htmlFor="excludeSameDomain"
                            className={`text-sm cursor-pointer hover:text-foreground transition-colors ${
                              includeDomains.trim().length > 0
                                ? "text-muted-foreground/50 cursor-not-allowed"
                                : "text-muted-foreground"
                            }`}
                          >
                            Exclude results from the same domain
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex flex-row justify-between items-center">
          {!activeQuery?.data && !activeQuery && !results && (
            <div className="flex items-center justify-end text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-muted rounded text-xs">⌘</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd>
                <span className="ml-1">to submit</span>
              </div>
            </div>
          )}

          {activeQuery?.data && results && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{activeQuery.data.searchTime.toFixed(0)}ms</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>${activeQuery.data.costDollars.total.toFixed(4)}</span>
              </div>
              <BaseBadge variant="default">
                {results.length} of {totalResults || 0} result
                {(totalResults || 0) !== 1 ? "s" : ""} (Page {currentPage || 1}
                {pagination?.totalPages ? ` of ${pagination.totalPages}` : ""})
              </BaseBadge>
              {searchType === "search" &&
              activeQuery.data &&
              "resolvedSearchType" in activeQuery.data ? (
                <BaseBadge variant="outline">
                  {(activeQuery.data as any).resolvedSearchType}
                </BaseBadge>
              ) : searchType === "similar" ? (
                <BaseBadge variant="outline">similar</BaseBadge>
              ) : null}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
