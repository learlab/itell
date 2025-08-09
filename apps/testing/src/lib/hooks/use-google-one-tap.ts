import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as Sentry from "@sentry/nextjs";

import { useSession } from "@/components/provider/page-provider";
import {
  GoogleApiService,
  GoogleLoginResponse,
  GoogleLoginService,
  GoogleOneTapFallbackHandler,
  GoogleOneTapInitializer,
} from "@/lib/google-one-tap";

interface UseGoogleOneTapReturn {
  scriptLoaded: boolean;
  isProcessing: boolean;
  onScriptLoad: () => void;
  onScriptError: (e: any) => void;
}

export function useGoogleOneTap(): UseGoogleOneTapReturn {
  const router = useRouter();
  const { user } = useSession();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  /**
   * 处理 Google 登录成功后的重定向
   */
  const handleLoginSuccess = useCallback(
    (data: GoogleLoginResponse) => {
      const { accessToken, refreshToken, expiresIn, firstLogin } = data;
      console.log("handle login success data", data);
      return;
      const redirectUrl = `/auth/google/callback?accessToken=${accessToken}&refreshToken=${refreshToken}&expiresIn=${expiresIn}&firstLogin=${Number(firstLogin)}`;
      router.push(redirectUrl);
    },
    [router]
  );

  const handleGoogleCallback = useCallback(
    async (response: google.accounts.id.CredentialResponse) => {
      if (isProcessing || !response.credential) {
        return;
      }

      setIsProcessing(true);

      try {
        const loginService = new GoogleLoginService(handleLoginSuccess);
        await loginService.processLogin(response.credential);
      } catch (error: any) {
        Sentry.captureException(error);
        console.error("Google One Tap processing error:", error);
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing, handleLoginSuccess]
  );

  const initializeGoogleOneTap = useCallback(() => {
    if (!googleClientId) {
      console.warn(
        "Google One Tap: NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured."
      );
      return;
    }

    const config: google.accounts.id.IdConfiguration = {
      client_id: googleClientId,
      callback: handleGoogleCallback,
      auto_select: true,
      cancel_on_tap_outside: false,
      context: "use",
      ux_mode: "popup",
    };

    const fallbackHandler = (
      fallbackConfig: google.accounts.id.IdConfiguration
    ) => {
      GoogleOneTapFallbackHandler.handle(fallbackConfig);
    };

    const initializer = new GoogleOneTapInitializer(fallbackHandler);
    initializer.initialize(config);
  }, [googleClientId, handleGoogleCallback]);

  useEffect(() => {
    if (!scriptLoaded || !googleClientId) {
      return;
    }

    if (user || isProcessing) {
      // 如果用户已登录，取消 One Tap UI
      GoogleApiService.cleanup();
      return;
    }

    const cleanup = GoogleApiService.checkAvailability();
    if (cleanup) {
      return cleanup;
    }

    initializeGoogleOneTap();

    return () => GoogleApiService.cleanup();
  }, [scriptLoaded]);

  const onScriptLoad = useCallback(() => {
    setScriptLoaded(true);
  }, []);

  const onScriptError = useCallback((e: any) => {
    // 使用警告级别日志而不是异常捕获，避免过度使用 Sentry 资源
    Sentry.logger.warn("Google One Tap script load failed", {
      error: e?.message || "Unknown script error",
      code: "SCRIPT_LOAD_FAILED",
    });

    console.error("Google One Tap: Failed to load GSI script:", e);
  }, []);

  return {
    scriptLoaded,
    isProcessing,
    onScriptLoad,
    onScriptError,
  };
}
