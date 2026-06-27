import api from './api'

export const followUser = (id) =>
  api.post(`/users/${id}/follow/`)

export const unfollowUser = (id) =>
  api.delete(`/users/${id}/follow/`)

export const getFollowers = (id) =>
  api.get(`/users/${id}/followers/`)

export const getFollowing = (id) =>
  api.get(`/users/${id}/following/`)

export const saveProject = (id) =>
  api.post(`/projects/${id}/save/`)

export const unsaveProject = (id) =>
  api.delete(`/projects/${id}/save/`)

export const getSavedProjects = () =>
  api.get('/users/me/saved-projects/')