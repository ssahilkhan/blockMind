"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchSchema, type SearchInput } from "@/lib/validators/explorer";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export function SearchBar({
  placeholder = "Search by block number, hash, or tx hash...",
  onSearch,
}: SearchBarProps) {
  const router = useRouter();
  const [searchError, setSearchError] = useState<string | null>(null);

  const { register, handleSubmit } = useForm<SearchInput>({
    resolver: zodResolver(searchSchema),
  });

  const onSubmit = (data: SearchInput) => {
    setSearchError(null);
    const query = data.query.trim();

    if (onSearch) {
      onSearch(query);
      return;
    }

    if (/^\d+$/.test(query)) {
      router.push(`/blocks/${query}`);
    } else if (/^0x[0-9a-fA-F]{64}$/.test(query)) {
      router.push(`/transactions/${query}`);
    } else {
      setSearchError("Could not determine search type. Enter a block number or hash.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          className="pl-9"
          {...register("query")}
        />
      </div>
      <Button type="submit">Search</Button>
      {searchError && (
        <p className="absolute mt-1 text-xs text-destructive">{searchError}</p>
      )}
    </form>
  );
}
