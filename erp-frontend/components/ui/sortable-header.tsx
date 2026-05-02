import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SortState } from "@/hooks/use-table";

interface SortableHeaderProps {
  column: string;
  label: string;
  sort: SortState | null;
  onSort: (column: string) => void;
  className?: string;
}

export function SortableHeader({ column, label, sort, onSort, className }: SortableHeaderProps) {
  const active = sort?.column === column;
  return (
    <button
      type="button"
      onClick={() => onSort(column)}
      className={cn(
        "flex items-center gap-1 font-bold uppercase text-[10px] tracking-widest hover:text-foreground transition-colors",
        active ? "text-foreground" : "text-muted-foreground",
        className
      )}
    >
      {label}
      {active ? (
        sort.direction === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
      ) : (
        <ArrowUpDown className="h-3 w-3 opacity-40" />
      )}
    </button>
  );
}
