import { motion } from 'framer-motion';
import { MessageSquare, Star, User, Calendar, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FeedbackItem {
  id: string;
  data: Record<string, unknown>;
}

interface FeedbackPageProps {
  feedbackItems: FeedbackItem[];
  isLoading?: boolean;
  searchQuery?: string;
}

export function FeedbackPage({ feedbackItems, isLoading, searchQuery }: FeedbackPageProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
        <span className="text-muted-foreground">Loading feedback...</span>
      </div>
    );
  }

  const filtered = searchQuery
    ? feedbackItems.filter((item) => {
        const str = JSON.stringify(item.data).toLowerCase();
        return str.includes(searchQuery.toLowerCase());
      })
    : feedbackItems;

  if (filtered.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16"
      >
        <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium text-foreground">No feedback found</p>
        <p className="text-sm text-muted-foreground mt-1">
          Feedback entries will appear here once submitted.
        </p>
      </motion.div>
    );
  }

  const getRating = (data: Record<string, unknown>): number | null => {
    const val = data.rating ?? data.score ?? data.stars;
    return typeof val === 'number' ? val : null;
  };

  const getSentiment = (data: Record<string, unknown>): string | null => {
    const val = data.sentiment ?? data.type ?? data.category;
    return typeof val === 'string' ? val : null;
  };

  const sentimentColor = (s: string | null) => {
    if (!s) return 'secondary';
    const lower = s.toLowerCase();
    if (['positive', 'good', 'great', 'excellent'].includes(lower)) return 'default';
    if (['negative', 'bad', 'poor'].includes(lower)) return 'destructive';
    return 'secondary';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Feedback</h2>
          <p className="text-muted-foreground text-sm">{filtered.length} entries</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item, index) => {
          const d = item.data;
          const rating = getRating(d);
          const sentiment = getSentiment(d);
          const name = (d.name ?? d.customerName ?? d.userName ?? 'Anonymous') as string;
          const message = (d.message ?? d.feedback ?? d.comment ?? d.text ?? '') as string;
          const email = (d.email ?? '') as string;
          const dateVal = d.createdAt ?? d.date ?? d.timestamp;
          let dateStr = '';
          if (dateVal) {
            try {
              const ts = typeof dateVal === 'object' && 'seconds' in (dateVal as any)
                ? new Date((dateVal as any).seconds * 1000)
                : new Date(dateVal as string | number);
              dateStr = ts.toLocaleDateString();
            } catch {
              dateStr = String(dateVal);
            }
          }

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="card-elevated h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-sm font-semibold truncate">{name}</CardTitle>
                        {email && <p className="text-xs text-muted-foreground truncate">{email}</p>}
                      </div>
                    </div>
                    {sentiment && (
                      <Badge variant={sentimentColor(sentiment) as any} className="text-xs flex-shrink-0">
                        {sentiment}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  {rating !== null && (
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/30'}`}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">{rating}/5</span>
                    </div>
                  )}
                  {message && (
                    <p className="text-sm text-foreground line-clamp-4">{message}</p>
                  )}
                  {dateStr && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {dateStr}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
