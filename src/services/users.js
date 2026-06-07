import api from './api'

export const getMe = () =>
  api.get('/users/me/')

export const updateMe = (data) =>
  api.put('/users/me/', data)

export const getPublicProfile = (id) =>
  api.get(`/users/${id}/`)