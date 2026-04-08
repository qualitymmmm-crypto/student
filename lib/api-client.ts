// API client helper functions
export const apiClient = {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }
    return response.json()
  },

  async post<T>(url: string, data: any): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }
    return response.json()
  },

  async put<T>(url: string, data: any): Promise<T> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }
    return response.json()
  },

  async delete<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }
    return response.json()
  },
}

// Course API
export const courseAPI = {
  getAll: () => apiClient.get('/api/courses'),
  create: (data: any) => apiClient.post('/api/courses', data),
  getById: (courseId: string) => apiClient.get(`/api/courses/${courseId}`),
  update: (courseId: string, data: any) => apiClient.put(`/api/courses/${courseId}`, data),
  delete: (courseId: string) => apiClient.delete(`/api/courses/${courseId}`),
}

// Video API
export const videoAPI = {
  add: (courseId: string, data: any) => apiClient.post(`/api/courses/${courseId}/videos`, data),
  update: (courseId: string, videoId: string, data: any) =>
    apiClient.put(`/api/courses/${courseId}/videos/${videoId}`, data),
  delete: (courseId: string, videoId: string) =>
    apiClient.delete(`/api/courses/${courseId}/videos/${videoId}`),
}

// Quiz API
export const quizAPI = {
  add: (courseId: string, data: any) => apiClient.post(`/api/courses/${courseId}/quizzes`, data),
  update: (courseId: string, quizId: string, data: any) =>
    apiClient.put(`/api/courses/${courseId}/quizzes/${quizId}`, data),
  delete: (courseId: string, quizId: string) =>
    apiClient.delete(`/api/courses/${courseId}/quizzes/${quizId}`),
  submitResult: (data: any) => apiClient.post('/api/quiz/results', data),
  getResults: (studentId: string, quizId?: string) => {
    const params = new URLSearchParams({ studentId })
    if (quizId) params.append('quizId', quizId)
    return apiClient.get(`/api/quiz/results?${params}`)
  },
}

// Student Progress API
export const progressAPI = {
  update: (data: any) => apiClient.post('/api/student/progress', data),
  get: (studentId: string, courseId?: string) => {
    const params = new URLSearchParams({ studentId })
    if (courseId) params.append('courseId', courseId)
    return apiClient.get(`/api/student/progress?${params}`)
  },
}

// Access Code API
export const accessCodeAPI = {
  create: (courseId: string) => apiClient.post(`/api/courses/${courseId}/access-codes`, {}),
  getAll: (courseId: string) => apiClient.get(`/api/courses/${courseId}/access-codes`),
  use: (courseId: string, data: any) =>
    apiClient.put(`/api/courses/${courseId}/access-codes`, data),
}
