import { FC, useEffect, useState } from "react"

interface EmailVerificationBadgeProps {
  emailVerified: boolean | null
  isAnimating?: boolean
  onAnimationComplete?: () => void
}

export const EmailVerificationBadge: FC<EmailVerificationBadgeProps> = ({
  emailVerified,
  isAnimating = false,
  onAnimationComplete,
}) => {
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (!isAnimating) return

    setAnimating(true)
    const timer = setTimeout(() => {
      setAnimating(false)
      onAnimationComplete?.()
    }, 800)

    return () => clearTimeout(timer)
  }, [isAnimating, onAnimationComplete])

  // ──────────────────────────────
  // ANIMATING STATE
  // ──────────────────────────────
  if (animating) {
    return (
      <div className="inline-flex items-center">
        {emailVerified ? (
          <div className="relative">
            <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-75"></div>
            <div className="relative bg-green-100 rounded-full p-1">
              <svg
                className="w-4 h-4 text-green-600 animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute inset-0 bg-red-200 rounded-full animate-ping opacity-75"></div>
            <div className="relative bg-red-100 rounded-full p-1  scale-125 ">
              <svg
                className="w-4 h-4 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ──────────────────────────────
  // STATIC STATE
  // ──────────────────────────────
  if (emailVerified === null) {
    return (
      <span className="inline-flex items-center">
        <div className="w-5 h-5 flex items-center justify-center">
          <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
      </span>
    )
  }

  return (
    <span className="inline-flex items-center">
      <div
        className={`rounded-full p-1 ${
          emailVerified ? "bg-green-100" : "bg-red-100"
        }`}
      >
        {emailVerified ? (
          <svg
            className="w-3 h-3 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg
            className="w-3 h-3 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
      </div>
    </span>
  )
}
