import api from './api'

export const getNotifications = () =>
  api.get('/notifications/')

export const markAsRead = (id) =>
  api.patch(`/notifications/${id}/read/`)