"use client"

import React, { useEffect, useState, useRef } from "react"

interface TransitionMountProps {
  visible: boolean
  children: React.ReactNode
  duration?: number
}

export default function TransitionMount({ visible, children, duration = 300 }: TransitionMountProps) {
  const [mounted, setMounted] = useState(visible)
  const [status, setStatus] = useState<'enter' | 'entered' | 'exit' | 'exited'>(visible ? 'entered' : 'exited')
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (visible) {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
      }
      setMounted(true)
      // next tick -> enter
      requestAnimationFrame(() => setStatus('enter'))
      // after a frame, mark entered so classes can transition
      timerRef.current = window.setTimeout(() => setStatus('entered'), 20)
    } else {
      // start exit
      setStatus('exit')
      timerRef.current = window.setTimeout(() => {
        setStatus('exited')
        setMounted(false)
      }, duration)
    }

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [visible, duration])

  if (!mounted) return null

  const className =
    status === 'enter'
      ? 'opacity-0 translate-y-2'
      : status === 'entered'
      ? 'opacity-100 translate-y-0'
      : status === 'exit'
      ? 'opacity-0 -translate-y-2'
      : 'opacity-0'

  return (
    <div className={`transition-opacity transition-transform duration-300 ease-in-out ${className}`}>
      {children}
    </div>
  )
}
