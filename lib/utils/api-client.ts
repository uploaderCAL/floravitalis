// API client utility with authentication support
export class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl = "/api") {
    this.baseUrl = baseUrl

    // Get token from localStorage (in production, use secure storage)
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("floravitalis-user")
      if (user) {
        try {
          const userData = JSON.parse(user)
          this.token = userData.email // Using email as token for demo
        } catch (error) {
          console.error("Failed to parse user data:", error)
        }
      }
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    return headers
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Network error" }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Network error" }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Network error" }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Network error" }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  setToken(token: string) {
    this.token = token
  }

  clearToken() {
    this.token = null
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
