'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Plane, Hotel, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

export interface Suggestion {
  id: string;
  displayName: string;
  city: string;
  country: string;
  countryCode?: string;
  type: 'city' | 'hotel' | 'airport';
  lat?: number;
  lng?: number;
  source: 'catalogue' | 'nominatim';
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  type?: 'destination' | 'origin';
}

export function DestinationAutocomplete({
  value,
  onChange,
  placeholder,
  className = '',
  type = 'destination',
}: Props) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Click outside closes
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // Debounced fetch
  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    if (!value || value.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    debounce.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(value)}`);
        const data = await res.json();
        setSuggestions(data.suggestions ?? []);
        setOpen(true);
        setActiveIdx(-1);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [value]);

  const pick = (s: Suggestion) => {
    onChange(type === 'origin' ? s.city : s.city);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onKeyDown={(e) => {
          if (!open) return;
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIdx((i) => Math.max(i - 1, 0));
          } else if (e.key === 'Enter' && activeIdx >= 0) {
            e.preventDefault();
            pick(suggestions[activeIdx]);
          } else if (e.key === 'Escape') {
            setOpen(false);
          }
        }}
        placeholder={placeholder}
        autoComplete="off"
      />

      {open && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-card border rounded-xl shadow-card-hover overflow-hidden max-h-80 overflow-y-auto">
          {loading && suggestions.length === 0 && (
            <div className="px-3 py-3 text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Searching the world…
            </div>
          )}
          {!loading && suggestions.length === 0 && (
            <div className="px-3 py-3 text-sm text-muted-foreground">
              No matches. Try a different spelling.
            </div>
          )}
          {suggestions.map((s, i) => {
            const Icon = s.type === 'hotel' ? Hotel : s.type === 'airport' ? Plane : MapPin;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => pick(s)}
                onMouseEnter={() => setActiveIdx(i)}
                className={`w-full text-left px-3 py-2.5 flex items-center gap-2.5 text-sm hover:bg-accent transition-colors ${
                  i === activeIdx ? 'bg-accent' : ''
                }`}
              >
                <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{s.displayName}</div>
                  <div className="text-xs text-muted-foreground">
                    {s.type === 'hotel' ? 'Hotel' : s.type === 'airport' ? 'Airport' : 'City'}
                    {s.source === 'nominatim' && ' · global'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}