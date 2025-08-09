import * as Sentry from "@sentry/nextjs";
import { decodeIdToken } from "arctic";

export type GoogleLoginResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  firstLogin: boolean;
};

export interface GoogleApiError extends Error {
  /** 错误代码 */
  code?: string;
  /** 错误详情 */
  details?: string;
}

export class FedCMService {
  static checkSupport(): boolean {
    return Sentry.startSpan(
      {
        op: "auth.fedcm-check",
        name: "Check FedCM Support",
      },
      (span) => {
        const hasFedCM = "IdentityCredential" in window;
        const hasCredentialsAPI = "credentials" in navigator;

        span.setAttribute("hasFedCM", hasFedCM);
        span.setAttribute("hasCredentialsAPI", hasCredentialsAPI);

        return hasFedCM && hasCredentialsAPI;
      }
    );
  }
}

export class GoogleOneTapInitializer {
  private supportsFedCM: boolean;
  private fallbackHandler: (config: google.accounts.id.IdConfiguration) => void;

  constructor(
    fallbackHandler: (config: google.accounts.id.IdConfiguration) => void
  ) {
    this.supportsFedCM = FedCMService.checkSupport();
    this.fallbackHandler = fallbackHandler;
  }

  /**
   * 初始化 Google One Tap
   */
  initialize(config: google.accounts.id.IdConfiguration): void {
    Sentry.startSpan(
      {
        op: "auth.init",
        name: "Initialize Google One Tap",
      },
      (span) => {
        span.setAttribute("clientId", config.client_id);
        span.setAttribute("autoSelect", config.auto_select);
        span.setAttribute("supportsFedCM", this.supportsFedCM);

        try {
          const enhancedConfig = this.createEnhancedConfig(config);
          window.google.accounts.id.initialize(enhancedConfig);
          this.promptUser(config, span);
          span.setAttribute("initSuccess", true);
        } catch (error) {
          this.handleInitError(error, config, span);
        }
      }
    );
  }

  private createEnhancedConfig(
    config: google.accounts.id.IdConfiguration
  ): google.accounts.id.IdConfiguration {
    return {
      ...config,
      use_fedcm_for_prompt: this.supportsFedCM,
    };
  }

  private promptUser(
    config: google.accounts.id.IdConfiguration,
    span: any
  ): void {
    window.google.accounts.id.prompt((notification: any) => {
      try {
        this.handlePromptNotification(notification, config, span);
      } catch (notificationError) {
        this.handleNotificationError(notificationError, config, span);
      }
    });
  }

  private handlePromptNotification(
    notification: any,
    config: google.accounts.id.IdConfiguration,
    span: any
  ): void {
    const isNotDisplayed = notification.isNotDisplayed?.();
    const isSkippedMoment = notification.isSkippedMoment?.();

    if (isNotDisplayed || isSkippedMoment) {
      const reason = this.getPromptSkipReason(notification);
      span.setAttribute("promptDisplayed", false);
      span.setAttribute("promptSkipReason", reason);

      console.warn(
        `Google One Tap prompt was not displayed or skipped. Reason: ${reason}`
      );

      // 根据 Google 官方文档，用户手动关闭会触发冷却期
      // 此时应该尊重用户选择，不进行降级处理
      if (this.shouldAttemptFallback(reason)) {
        console.log("Attempting FedCM fallback...");
        this.fallbackHandler(config);
      } else if (reason === "user_cancel") {
        console.log(
          "User manually closed One Tap, respecting user choice and not attempting fallback"
        );
      }
    } else {
      span.setAttribute("promptDisplayed", true);
      console.log("Google One Tap prompt displayed successfully");
    }
  }

  private getPromptSkipReason(notification: any): string {
    try {
      return (
        notification.getNotDisplayedReason?.() ||
        notification.getSkippedReason?.() ||
        "fedcm_method_unavailable"
      );
    } catch (methodError) {
      console.warn("FedCM mode: notification methods not available");
      return "fedcm_method_unavailable";
    }
  }

  private shouldAttemptFallback(reason: string): boolean {
    // 根据 Google One Tap 官方文档，用户手动关闭时会触发冷却期
    // 此时不应该进行降级处理，而应该尊重用户的选择
    const userCancelReasons = ["user_cancel", "suppressed_by_user"];

    // 如果是用户主动取消，不进行降级处理
    if (userCancelReasons.includes(reason)) {
      return false;
    }

    // 只有在技术性问题时才进行降级处理
    const technicalFailureReasons = [
      "fedcm_method_unavailable",
      "browser_not_supported",
      "invalid_client",
      "missing_client_id",
      "secure_http_required",
      "unregistered_origin",
    ];

    return technicalFailureReasons.includes(reason);
  }

  private handleNotificationError(
    notificationError: any,
    config: google.accounts.id.IdConfiguration,
    span: any
  ): void {
    span.setAttribute("notificationError", true);
    console.warn("Error in prompt notification callback:", notificationError);

    if (this.supportsFedCM) {
      console.log("Notification error detected, attempting fallback...");
      this.fallbackHandler(config);
    }
  }

  private handleInitError(
    error: any,
    config: google.accounts.id.IdConfiguration,
    span: any
  ): void {
    span.setAttribute("initSuccess", false);
    const initError: GoogleApiError = error as GoogleApiError;
    initError.code = "INIT_FAILED";
    Sentry.captureException(initError);
    console.error("Error initializing Google One Tap:", error);

    if (this.supportsFedCM) {
      console.log("Initialization failed, attempting fallback...");
      this.fallbackHandler(config);
    }
  }
}

/**
 * Google One Tap 降级处理服务
 */
export class GoogleOneTapFallbackHandler {
  /**
   * 处理 FedCM 权限错误的降级方案
   */
  static handle(config: google.accounts.id.IdConfiguration): void {
    Sentry.startSpan(
      {
        op: "auth.fedcm-fallback",
        name: "FedCM Fallback Initialization",
      },
      (span) => {
        span.setAttribute("fallbackReason", "fedcm_permission_denied");

        try {
          const fallbackConfig: google.accounts.id.IdConfiguration = {
            ...config,
            use_fedcm_for_prompt: false,
          };

          window.google.accounts.id.initialize(fallbackConfig);
          GoogleOneTapFallbackHandler.promptWithFallback(span);
          span.setAttribute("fallbackSuccess", true);
        } catch (error) {
          span.setAttribute("fallbackSuccess", false);
          Sentry.captureException(error);
          console.error("FedCM fallback failed:", error);
        }
      }
    );
  }

  private static promptWithFallback(span: any): void {
    window.google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed?.()) {
        const reason = notification.getNotDisplayedReason?.() || "unknown";
        span.setAttribute("promptDisplayed", false);
        span.setAttribute("promptSkipReason", reason);
        console.warn(
          `Google One Tap (fallback) prompt was not displayed. Reason: ${reason}`
        );
      } else {
        span.setAttribute("promptDisplayed", true);
        console.log("Google One Tap (fallback) prompt displayed successfully");
      }
    });
  }
}

/**
 * Service to process google login response
 */
export class GoogleLoginService {
  constructor(private handleLoginSuccess: (data: any) => void) {}

  async processLogin(idToken: string): Promise<void> {
    return Sentry.startSpan(
      {
        op: "http.client",
        name: "Google Login API Call",
      },
      async (span) => {
        span.setAttribute("hasIdToken", !!idToken);

        try {
          const data = decodeIdToken(idToken);
          this.handleLoginSuccess(data);
          span.setAttribute("loginSuccess", true);
        } catch (error) {
          this.handleLoginError(error, span);
          span.setAttribute("loginSuccess", false);
          Sentry.captureException(error);
          throw error;
        }
      }
    );
  }

  private handleLoginError(error: unknown, span: any): void {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    span.setAttribute("loginSuccess", false);
    span.setAttribute("errorMessage", errorMessage);

    const apiError: GoogleApiError = new Error(
      `Google Login API Error: ${errorMessage}`
    );

    Sentry.captureException(apiError);
  }
}

/**
 * Service to check Google API availability
 */
export class GoogleApiService {
  static checkAvailability(): (() => void) | undefined {
    return Sentry.startSpan(
      {
        op: "auth.check",
        name: "Check Google API Availability",
      },
      (span) => {
        const isAvailable = !!window.google?.accounts?.id;
        span.setAttribute("apiAvailable", isAvailable);

        if (!isAvailable) {
          const timer = setTimeout(() => {
            if (!window.google?.accounts?.id) {
              Sentry.logger.warn("Google Sign-In API failed to initialize", {
                code: "API_INIT_FAILED",
                timeout: "2000ms",
              });
            }
          }, 2000);
          return () => clearTimeout(timer);
        }

        return undefined;
      }
    );
  }

  static cleanup(): void {
    Sentry.startSpan(
      {
        op: "auth.cleanup",
        name: "Cleanup Google One Tap",
      },
      (span) => {
        if (window.google?.accounts?.id) {
          window.google.accounts.id.cancel();
          span.setAttribute("cleaned", true);
        } else {
          span.setAttribute("cleaned", false);
          span.setAttribute("reason", "api_not_available");
        }
      }
    );
  }
}
