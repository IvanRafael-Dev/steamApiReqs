const models = require('../models/Games');

const isValidAppId = (isDataValid) => {  
  if (!isDataValid) {
    const error = new Error('AppId não foi encontrado');
    error.statusCode = 'appid_not_found';
    throw error;
  }
} 

const isUser = (user) => {
  if (!user) {
    const error = new Error('Usuário não encontrado');
    error.statusCode = 'user_not_found';
    throw error;
  }
};

const hasFavorites = ({ favorites }) => {
  if (favorites[0] === null) {
    const error = new Error('Usuário não tem favoritos');
    error.statusCode = 'favs_not_found';
    throw error;
  }
}

const checkFavorite = async (username, appId) => {
  const alreadyExists = await models.isFavorite(username, appId);
  if (alreadyExists) {
    const error = new Error(`O usuário ${username} já possui o jogo: "${Object.values(appId)[1]}" como favorito.`);
    error.statusCode = 'alreadyFavorite';
    throw error;
  }
}

const newFavorite = async (username, favorite, isDataValid) => {
  isValidAppId(isDataValid);
  await checkFavorite(username, favorite);
  const result = await models.newFavorite(username, favorite);
  return result;
};

const getUserFavorites = async (user) => {
  const result = await models.getUserFavorites(user);
  isUser(result);
  hasFavorites(result);
  return result;
};

const deleteUserFavorite = async (username, appId) => {
  const result = await models.deleteUserFavorite(username, appId);
  console.log(result);
  return {
    message: `Favorito "${appId}" excluído com sucesso`,
    status: 200,
  }
}

module.exports = {
  newFavorite,
  getUserFavorites,
  deleteUserFavorite,
}