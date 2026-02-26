"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { ChevronDown } from "lucide-react";

interface BookSelectorProps {
  value: string;
  onChange: (book: string) => void;
  books: readonly string[];
}

export function BookSelector({ value, onChange, books }: BookSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listboxId = "book-selector-listbox";

  // Sync input text when value prop changes (form reset, edit mode)
  useEffect(() => {
    setQuery(value);
  }, [value]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [...books];

    return books.filter((book) => {
      const lower = book.toLowerCase();
      // Match from start of full name
      if (lower.startsWith(q)) return true;
      // Match after number prefix (e.g. "cor" → "1 Corinthians")
      const spaceIdx = lower.indexOf(" ");
      if (spaceIdx !== -1 && /^\d/.test(lower)) {
        return lower.slice(spaceIdx + 1).startsWith(q);
      }
      return false;
    });
  }, [query, books]);

  // Reset highlight when filtered list changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filtered.length]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (!isOpen || !listRef.current) return;
    const item = listRef.current.children[highlightedIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex, isOpen]);

  const open = useCallback(() => {
    setIsOpen(true);
    setHighlightedIndex(0);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Revert input to current value (never leave an invalid book)
    setQuery(value);
  }, [value]);

  const select = useCallback(
    (book: string) => {
      onChange(book);
      setQuery(book);
      setIsOpen(false);
      inputRef.current?.blur();
    },
    [onChange],
  );

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, close]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        open();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % filtered.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
        break;
      case "Enter":
        e.preventDefault();
        if (filtered[highlightedIndex]) {
          select(filtered[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        close();
        inputRef.current?.blur();
        break;
      case "Tab":
        close();
        break;
    }
  };

  const activeDescendant = isOpen && filtered.length > 0
    ? `book-option-${highlightedIndex}`
    : undefined;

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={activeDescendant}
          aria-autocomplete="list"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) open();
          }}
          onFocus={() => {
            open();
            // Select all text so typing replaces it
            inputRef.current?.select();
          }}
          onKeyDown={handleKeyDown}
          className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-lg font-serif font-medium rounded-xl p-3 pr-10 focus:ring-2 focus:ring-stone-900 focus:border-stone-900 outline-none"
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label="Toggle book list"
          onMouseDown={(e) => {
            // Prevent blur from firing before toggle
            e.preventDefault();
            if (isOpen) {
              close();
            } else {
              inputRef.current?.focus();
            }
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 transition-colors"
        >
          <ChevronDown
            size={18}
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {isOpen && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          className="absolute z-10 mt-1 w-full bg-white border border-stone-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
        >
          {filtered.length > 0 ? (
            filtered.map((book, index) => (
              <li
                key={book}
                id={`book-option-${index}`}
                role="option"
                aria-selected={book === value}
                onMouseDown={(e) => {
                  // Prevent input blur from firing before selection
                  e.preventDefault();
                  select(book);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`px-3 py-2 cursor-pointer text-sm font-serif transition-colors ${
                  index === highlightedIndex
                    ? "bg-stone-100 text-stone-900"
                    : "text-stone-700 hover:bg-stone-50"
                } ${book === value ? "font-semibold" : ""}`}
              >
                {book}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-sm text-stone-400 italic">
              No books found
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
