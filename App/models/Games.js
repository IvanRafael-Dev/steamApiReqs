const connection = require('./connection');

const newFavorite = async (username, appId) => {
  const isUser = await connection()
    .then((db) => db.collection('favorite').findOne({ username }));
  
  if (!isUser) {
    await connection()
    .then((db) => db.collection('favorite').insertOne({ username }));
  }

  await connection()
    .then((db) => db
      .collection('favorite')
      .findOneAndUpdate({ username }, { $push: { appId: appId }}, { returnOriginal: false }));
      
  return { username, favorited: appId};
};

const isFavorite = async (username, appId) => 
  connection()
    .then((db) => db.collection('favorite').findOne({ username, appId: { $in: [appId] } }));

const getUserFavorites = async (username) => {
  const result = connection()
    .then((db) => db.collection('favorite').findOne({ username }))
    .then(({ appId, username }) => ({ favorites: appId, username }))
    .catch(() => false);
  return result;
};

const deleteUserFavorite = async (username, appId) => {
  const result = await connection()
    .then((db) => db
      .collection('favorite')
      .findOneAndUpdate({ username }, { $pull: { appId: Object({ steam_appid: +(appId) })}}, { returnOriginal: false }));
  
  return result;
};



// fazer um service para validar se appId ja existte para usuario
// se existir lancar erro que o favorito ja existe para esse usuario

// retornar os favoeritos de um usuario

// const findUser = async (username) => {
//   const isUser = await connection
//     .then((db) => db.collection('favorite').findOne({ username }));
//   return isUser;
// }

module.exports = {
  newFavorite,
  isFavorite,
  getUserFavorites,
  deleteUserFavorite,
};
