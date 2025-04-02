// apps/chevron/src/components/providers/scorm-provider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Define the shape of our SCORM context
interface ScormContextType {
  isScorm: boolean;      // Whether we're in a SCORM environment
  scormUserId: string | null;  // The SCORM user ID if available
  isLoading: boolean;    // Whether we're still waiting for SCORM initialization
}

// Default context values
const defaultContext: ScormContextType = {
  isScorm: false,
  scormUserId: null,
  isLoading: true,
};

// Create the context
const ScormContext = createContext<ScormContextType>(defaultContext);

/**
 * SCORM Provider that checks for SCORM environment and provides the context
 * This should be used in your app layout
 */
export function ScormProvider({ children }: { children: React.ReactNode }) {
  const [scormState, setScormState] = useState<ScormContextType>(defaultContext);
  const router = useRouter();

  useEffect(() => {
    // Only run in client
    if (typeof window === "undefined") return;

    // Check if we're in an iframe
    const isInIframe = window !== window.parent;
    
    if (!isInIframe) {
      console.log("Not in iframe, not in SCORM environment");
      setScormState({
        isScorm: false,
        scormUserId: null,
        isLoading: false,
      });
      return;
    }

    console.log("In iframe, waiting for SCORM ID message...");

    // Set up message listener
    const messageHandler = (event: MessageEvent) => {
      
      
      if (event.data?.type === 'scormInit' && event.data?.scormUserId) {
        
        setScormState({
          isScorm: true,
          scormUserId: event.data.scormUserId,
          isLoading: false,
        });
        
        router.push(`/auth/scorm?scormUserId=${event.data.scormUserId}`);
      }
    };

    // Add message listener
    window.addEventListener('message', messageHandler);

    // Signal to parent that we're ready to receive the SCORM user ID
    try {
      console.log("Sending ready message to parent");
      window.parent.postMessage({ type: "scormReady" }, "*");
      console.log("Sent ready message to parent");
    } catch (e) {
      console.error("Error sending ready message to parent:", e);
    }

    // Set a timeout to stop waiting for messages
    const timeoutId = setTimeout(() => {
      console.log("Timeout waiting for SCORM initialization");
      window.removeEventListener('message', messageHandler);
      setScormState({...scormState,
        isLoading: false,
      });
      // redirect to the auth page instead of the route handler directly
      
    }, 8000); // Wait up to 8 seconds

    // Cleanup
    return () => {
      window.removeEventListener('message', messageHandler);
      clearTimeout(timeoutId);
    };
  }, [router]);

  return (
    <ScormContext.Provider value={scormState}>
      {children}
    </ScormContext.Provider>
  );
}

/**
 * Hook to access SCORM context
 */
export function useScorm() {
  return useContext(ScormContext);
}