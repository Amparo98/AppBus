const favoriteService = require('./favorite_service');

async function getFavorites(req, res, next) {
  try {
    const favorites = await favoriteService.getFavorites(req.user.id);
    res.status(200).json({ ok: true, favorites });
  } catch (error) {
    next(error);
  }
}

async function addFavorite(req, res, next) {
  try {
    const favorite = await favoriteService.addFavorite(req.user.id, req.body);
    res.status(201).json({ ok: true, message: 'Favorite added correctly', favorite });
  } catch (error) {
    next(error);
  }
}

async function deleteFavorite(req, res, next) {
  try {
    await favoriteService.deleteFavorite(req.params.id_favorite, req.user.id);
    res.status(200).json({ ok: true, message: 'Favorite deleted correctly' });
  } catch (error) {
    next(error);
  }
}

module.exports = { getFavorites, addFavorite, deleteFavorite };