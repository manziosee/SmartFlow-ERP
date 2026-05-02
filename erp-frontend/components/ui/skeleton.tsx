import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-accent animate-pulse rounded-md', className)}
      {...props}
    />
  )
}

function StatCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  )
}

function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden">
      <div className="border-b border-border/50 px-6 py-4 flex items-center gap-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-64 rounded-xl" />
      </div>
      <div className="divide-y divide-border/30">
        <div className="px-6 py-3 flex gap-6">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-3 flex-1" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, ri) => (
          <div key={ri} className="px-6 py-4 flex gap-6 items-center">
            {Array.from({ length: cols }).map((_, ci) => (
              <Skeleton key={ci} className={cn("h-4 flex-1", ci === 0 ? "max-w-[140px]" : "")} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function PageSkeleton({ cards = 4, rows = 8, cols = 5 }: { cards?: number; rows?: number; cols?: number }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>
      <StatCardsSkeleton count={cards} />
      <TableSkeleton rows={rows} cols={cols} />
    </div>
  )
}

export { Skeleton, StatCardsSkeleton, TableSkeleton, PageSkeleton }
