import api from './api'

export function getRecommendedProfiles(projectId) {
  return api.get(`/projects/${projectId}/recommend-profiles/`).then((res) => res.data)
}

export function getRecommendedProjects() {
  return api.get('/users/me/recommend-projects/').then((res) => res.data)
}