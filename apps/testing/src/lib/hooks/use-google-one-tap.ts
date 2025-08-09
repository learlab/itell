
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import * as Sentry from '@sentry/nextjs'
import {
  GoogleLoginService,
  GoogleOneTapInitializer,
  GoogleOneTapFallbackHandler,
  GoogleApiService,
  GoogleLoginResponse,
} from '@/lib/google-one-tap'

import { useSession } from '@/components/provider/page-provider'

interface UseGoogleOneTapReturn {
  /** 脚本是否已加载 */
  scriptLoaded: boolean
  /** 是否正在处理登录 */
  isProcessing: boolean
  /** 脚本加载成功回调 */
  onScriptLoad: () => void
  /** 脚本加载失败回调 */
  onScriptError: (e: any) => void
}

/**
 * Google One Tap 自定义 hook
 * 管理 Google One Tap 登录的完整生命周期
 */
export function useGoogleOneTap(): UseGoogleOneTapReturn {
  const router = useRouter()
  const { user } = useSession()
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  /**
   * 处理 Google 登录成功后的重定向
   */
  const handleLoginSuccess = useCallback(
    (data: GoogleLoginResponse) => {
      const { accessToken, refreshToken, expiresIn, firstLogin } = data
      const redirectUrl =
      `/auth/google/callback?accessToken=${accessToken}&refreshToken=${refreshToken}&expiresIn=${expiresIn}&firstLogin=${Number(firstLogin)}`
      router.push(redirectUrl)
    },
    [router],
  )

  /**
   * Google One Tap 回调处理函数
   */
  const handleGoogleCallback = useCallback(
    async (response: google.accounts.id.CredentialResponse) => {
      if (isProcessing || !response.credential) {
        return
      }

      setIsProcessing(true)

      try {
        const loginService = new GoogleLoginService(handleLoginSuccess)
        await loginService.processLogin(response.credential)
      } catch (error: any) {
        Sentry.captureException(error)
        console.error('Google One Tap processing error:', error)
      } finally {
        setIsProcessing(false)
      }
    },
    [isProcessing, handleLoginSuccess],
  )

  /**
   * 初始化 Google One Tap
   */
  const initializeGoogleOneTap = useCallback(() => {
    if (!googleClientId) {
      console.warn(
        'Google One Tap: NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured.',
      )
      return
    }

    const config: google.accounts.id.IdConfiguration = {
      client_id: googleClientId,
      callback: handleGoogleCallback,
      auto_select: true,
      cancel_on_tap_outside: false,
      context: 'use',
      ux_mode: 'popup',
    }

    const fallbackHandler = (
      fallbackConfig: google.accounts.id.IdConfiguration,
    ) => {
      GoogleOneTapFallbackHandler.handle(fallbackConfig)
    }

    const initializer = new GoogleOneTapInitializer(fallbackHandler)
    initializer.initialize(config)
  }, [googleClientId, handleGoogleCallback])

  /**
   * 主要的 useEffect 逻辑
   */
  useEffect(() => {
    if (!scriptLoaded || !googleClientId) {
      return
    }

    if (user || isProcessing) {
      // 如果用户已登录，取消 One Tap UI
      GoogleApiService.cleanup()
      return
    }

    // 检查 Google API 可用性
    const cleanup = GoogleApiService.checkAvailability()
    if (cleanup) {
      return cleanup
    }

    // 初始化 Google One Tap
    initializeGoogleOneTap()

    // 清理函数
    return () => GoogleApiService.cleanup()
  }, [scriptLoaded])

  /**
   * Script 加载成功回调
   */
  const onScriptLoad = useCallback(() => {
    setScriptLoaded(true)
  }, [])

  /**
   * Script 加载失败回调
   */
  const onScriptError = useCallback((e: any) => {
    // 使用警告级别日志而不是异常捕获，避免过度使用 Sentry 资源
    Sentry.logger.warn('Google One Tap script load failed', {
      error: e?.message || 'Unknown script error',
      code: 'SCRIPT_LOAD_FAILED',
    })

    console.error('Google One Tap: Failed to load GSI script:', e)
  }, [])

  return {
    scriptLoaded,
    isProcessing,
    onScriptLoad,
    onScriptError,
  }
}
