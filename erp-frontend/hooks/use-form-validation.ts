"use client";

import { useState, useCallback } from "react";

type Rules<T> = Partial<{
  [K in keyof T]: Array<(val: T[K]) => string | undefined>;
}>;

export function useFormValidation<T extends Record<string, any>>(rules: Rules<T>) {
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const validate = useCallback(
    (data: T): boolean => {
      const next: Partial<Record<keyof T, string>> = {};
      for (const key in rules) {
        for (const rule of rules[key] ?? []) {
          const msg = rule(data[key]);
          if (msg) { next[key] = msg; break; }
        }
      }
      setErrors(next);
      return Object.keys(next).length === 0;
    },
    [rules]
  );

  const clearError = useCallback((field: keyof T) => {
    setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  }, []);

  return { errors, validate, clearError, setErrors };
}

// ─── Common validators ────────────────────────────────────────────────────────
export const required = (msg = "This field is required") =>
  (v: any) => (!v || (typeof v === "string" && !v.trim())) ? msg : undefined;

export const email = (msg = "Enter a valid email address") =>
  (v: string) => v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? msg : undefined;

export const minLength = (n: number, msg?: string) =>
  (v: string) => v && v.trim().length < n ? (msg ?? `Minimum ${n} characters`) : undefined;

export const maxLength = (n: number, msg?: string) =>
  (v: string) => v && v.trim().length > n ? (msg ?? `Maximum ${n} characters`) : undefined;

export const positive = (msg = "Must be a positive number") =>
  (v: number | string) => Number(v) <= 0 ? msg : undefined;
