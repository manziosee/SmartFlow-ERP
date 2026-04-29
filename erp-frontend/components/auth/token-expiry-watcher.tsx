"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

/**
 * Watches the JWT token in localStorage and:
 * 1. Auto-logs out the user when the token expires
 * 2. Shows a warning toast 2 minutes before expiry
 */
export function TokenExpiryWatcher() {
  const { logout, isAuthenticated } = useAuth();
  const warnedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    function getTokenExpiry(): number | null {
      const token = localStorage.getItem("token");
      if (!token) return null;
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp ? payload.exp * 1000 : null; // convert to ms
      } catch {
        return null;
      }
    }

    const expiry = getTokenExpiry();
    if (!expiry) return;

    const now = Date.now();
    const msUntilExpiry = expiry - now;
    const msUntilWarn = msUntilExpiry - 2 * 60 * 1000; // 2 min before

    if (msUntilExpiry <= 0) {
      logout();
      return;
    }

    // Warning timer
    let warnTimer: ReturnType<typeof setTimeout> | undefined;
    if (msUntilWarn > 0) {
      warnTimer = setTimeout(() => {
        if (!warnedRef.current) {
          warnedRef.current = true;
          toast.warning("Your session expires in 2 minutes. Save your work.", {
            duration: 10000,
            action: { label: "Stay logged in", onClick: () => {} },
          });
        }
      }, msUntilWarn);
    }

    // Auto-logout timer
    const logoutTimer = setTimeout(() => {
      toast.error("Session expired. Please log in again.");
      logout();
    }, msUntilExpiry);

    return () => {
      clearTimeout(warnTimer);
      clearTimeout(logoutTimer);
    };
  }, [isAuthenticated, logout]);

  return null;
}
