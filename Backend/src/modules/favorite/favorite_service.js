const favoriteRepository = require('./favorite_repositories');
const appError = require('../../utils/appError');

async function getFavorites(client_id) {
  return await favoriteRepository.getFavoritesByClient(client_id);
}

async function addFavorite(client_id, data) {
  const { stop_id, route_id } = data;

  const exists = await favoriteRepository.existsFavorite(client_id, stop_id, route_id);
  if (exists) throw appError('FAVORITE_ALREADY_EXISTS', 409);

  return await favoriteRepository.addFavorite(client_id, stop_id, route_id);
}

async function deleteFavorite(id_favorite, client_id) {
  const favorite = await favoriteRepository.deleteFavorite(id_favorite, client_id);
  if (!favorite) throw appError('FAVORITE_NOT_FOUND', 404);
}

module.exports = { getFavorites, addFavorite, deleteFavorite };