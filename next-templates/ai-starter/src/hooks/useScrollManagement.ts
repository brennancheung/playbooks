import { useState, useRef, useEffect, DependencyList } from 'react'

export function useScrollManagement(dependencies: DependencyList = []) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isUserScrolling, setIsUserScrolling] = useState(false)
  
  const SCROLL_THRESHOLD = 10
  
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget
    const isAtBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < SCROLL_THRESHOLD
    setIsUserScrolling(!isAtBottom)
  }
  
  const resetScroll = () => setIsUserScrolling(false)
  
  useEffect(() => {
    if (scrollRef.current && !isUserScrolling) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserScrolling, ...dependencies])
  
  return { scrollRef, isUserScrolling, handleScroll, resetScroll }
}