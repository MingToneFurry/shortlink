import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { ShortLink, CreateLinkRequest, UpdateLinkRequest, LinkListResponse } from '@/types';

interface UseLinksReturn {
  links: ShortLink[];
  pagination: LinkListResponse['pagination'] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createLink: (data: CreateLinkRequest) => Promise<{ success: boolean; link?: ShortLink; error?: string }>;
  updateLink: (shortCode: string, data: UpdateLinkRequest) => Promise<{ success: boolean; link?: ShortLink; error?: string }>;
  deleteLink: (shortCode: string) => Promise<{ success: boolean; error?: string }>;
  getLink: (shortCode: string) => Promise<{ success: boolean; link?: ShortLink; error?: string }>;
}

export function useLinks(page: number = 1, limit: number = 50): UseLinksReturn {
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [pagination, setPagination] = useState<LinkListResponse['pagination'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLinks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getLinks(page, limit);
      setLinks(response.links);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch links');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const createLink = useCallback(async (data: CreateLinkRequest) => {
    try {
      const link = await api.createLink(data);
      await fetchLinks();
      return { success: true, link };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create link' 
      };
    }
  }, [fetchLinks]);

  const updateLink = useCallback(async (shortCode: string, data: UpdateLinkRequest) => {
    try {
      const link = await api.updateLink(shortCode, data);
      await fetchLinks();
      return { success: true, link };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update link' 
      };
    }
  }, [fetchLinks]);

  const deleteLink = useCallback(async (shortCode: string) => {
    try {
      await api.deleteLink(shortCode);
      await fetchLinks();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to delete link' 
      };
    }
  }, [fetchLinks]);

  const getLink = useCallback(async (shortCode: string) => {
    try {
      const link = await api.getLink(shortCode);
      return { success: true, link };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to get link' 
      };
    }
  }, []);

  return {
    links,
    pagination,
    isLoading,
    error,
    refetch: fetchLinks,
    createLink,
    updateLink,
    deleteLink,
    getLink,
  };
}
