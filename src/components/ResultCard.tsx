import { motion } from "framer-motion";
import {
  BaseCard,
  BaseCardContent,
  BaseCardHeader,
} from "@/components/cards/BaseCard";
import { BaseBadge } from "@/components/badges/BaseBadge";
import { ExternalLink, Calendar, User, Star } from "lucide-react";
import type { ExaSearchResult } from "@/types/exa";

interface ResultCardProps {
  result: ExaSearchResult;
  index?: number;
}

export function ResultCard({ result, index = 0 }: ResultCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return null;
    }
  };

  const formatScore = (score: number) => {
    return (score * 100).toFixed(1);
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
        delay: index * 0.1,
      }}
    >
      <BaseCard className="h-full hover:shadow-lg transition-shadow duration-200">
        <BaseCardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-2">
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {result.title}
                </a>
              </h3>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span className="font-medium">{getDomain(result.url)}</span>
                <ExternalLink className="h-3 w-3" />
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {result.publishedDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(result.publishedDate)}</span>
                  </div>
                )}

                {result.author && (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{result.author}</span>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  <span>{formatScore(result.score)}%</span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              {result.image ? (
                <img
                  src={result.image}
                  alt={result.title}
                  className="w-24 h-24 object-cover rounded-lg border border-border shadow-sm"
                  onError={(e) => {
                    console.log("Image failed to load:", result.image);
                    e.currentTarget.style.display = "none";
                  }}
                  loading="lazy"
                />
              ) : (
                <div className="w-24 h-24 bg-muted rounded-lg border border-border flex items-center justify-center text-xs text-muted-foreground">
                  No Image
                </div>
              )}
            </div>
          </div>
        </BaseCardHeader>

        <BaseCardContent className="pt-0">
          <div className="flex items-center justify-between mt-4">
            <BaseBadge variant="default" className="text-xs">
              Score: {formatScore(result.score)}%
            </BaseBadge>

            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              Visit Page
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </BaseCardContent>
      </BaseCard>
    </motion.div>
  );
}
