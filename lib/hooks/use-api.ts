"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/utils/api-client"

export function useApi<T>(endpoint: string, params?: Record<string, string>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await apiClient.get<T>(endpoint, params)
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [endpoint, JSON.stringify(params)])

  const refetch = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.get<T>(endpoint, params)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, refetch }
}

export function useMutation<T, U>(endpoint: string, method: "POST" | "PUT" | "DELETE" = "POST") {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = async (data?: U): Promise<T | null> => {
    try {
      setLoading(true)
      setError(null)

      let result: T
      switch (method) {
        case "POST":
          result = await apiClient.post<T>(endpoint, data)
          break
        case "PUT":
          result = await apiClient.put<T>(endpoint, data)
          break
        case "DELETE":
          result = await apiClient.delete<T>(endpoint)
          break
        default:
          throw new Error(`Unsupported method: ${method}`)
      }

      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      return null
    } finally {
      setLoading(false)
    }
  }

  return { mutate, loading, error }
}
