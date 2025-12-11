import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Fallback images for each step
const fallbackImages: Record<number, string> = {
  1: '/placeholder.svg',
  2: '/placeholder.svg',
  3: '/placeholder.svg',
  4: '/placeholder.svg',
  5: '/placeholder.svg',
  6: '/placeholder.svg',
  7: '/placeholder.svg',
  8: '/placeholder.svg',
  99: '/placeholder.svg',
};

// Cache for generated images
const imageCache: Record<number, string> = {};

export const useOnboardingIllustration = (step: number) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Check cache first
    if (imageCache[step]) {
      setImageUrl(imageCache[step]);
      setIsLoading(false);
      return;
    }

    // Cancel previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const generateIllustration = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error: fnError } = await supabase.functions.invoke('generate-illustration', {
          body: { step },
        });

        if (fnError) {
          throw new Error(fnError.message);
        }

        if (data?.imageUrl) {
          imageCache[step] = data.imageUrl;
          setImageUrl(data.imageUrl);
          console.log(`Illustration for step ${step} loaded (cached: ${data.cached})`);
        } else {
          throw new Error('No image URL returned');
        }
      } catch (err) {
        console.error('Error generating illustration:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate illustration');
        // Use fallback image on error
        setImageUrl(fallbackImages[step] || fallbackImages[1]);
      } finally {
        setIsLoading(false);
      }
    };

    generateIllustration();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [step]);

  return { imageUrl, isLoading, error };
};
