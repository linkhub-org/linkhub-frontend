import api from './api'

export const applyToProject = (projectId, message) =>
  api.post(`/projects/${projectId}/apply/`, { message })

export const getProjectApplications = (projectId) =>
  api.get(`/projects/${projectId}/applications/`)

export const updateApplication = (applicationId, status) =>
  api.patch(`/applications/${applicationId}/`, { status })

export const cancelApplication = (applicationId) =>
  api.delete(`/applications/${applicationId}/cancel/`)