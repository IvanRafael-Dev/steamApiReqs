const axios = require('axios').default;
const redis = require('promise-redis')();
const cache = redis.createClient();

const service = require('../services/Games');

const getAll = async (_req, res) => {
  console.time('request time');
  let appsCache = await cache.get('steamApps');
  
  if(!appsCache) {
    const { data: { applist: { apps } } } = await axios
      .get('https://api.steampowered.com/ISteamApps/GetAppList/v0002/?format=json');
    appsCache = await cache.set('steamApps', JSON.stringify(apps));
    console.log('sem cache');
    console.timeEnd('request time');
    return res.status(200).json(apps);

  } else {
    console.log('com cache');
    appsCache = await cache.get('steamApps');     
  }
    
  const parsedData = JSON.parse(appsCache);
    
  console.timeEnd('request time');
  return res.status(200).json(parsedData);
};

const findById =  async (req, res) => {
  const { id } = req.params;
  const { data } = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${id}`)
  console.log(data);
  const isAppValid = data[id].success;
  if (!isAppValid) return res.status(404).json({ message: `O appid: ${id} não foi encontrado.` });
  return res.status(200).json(data[id].data)
};

const newFavorite = async (req, res) => {
  const { username, appId } = req.body;
  const { data } = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appId}`)

  const isDataValid = data[appId].success;
  const favorite = data[appId].data;

  const result = await service.newFavorite(username, favorite, isDataValid);
  return res.status(201).json(result);
};

const getUserFavorites = async (req, res) => {
  const { username } = req.body;
  const result = await service.getUserFavorites(username);
  console.log(result.favorites.length);
  return res.status(200).json(result);
};

const deleteUserFavorite = async (req, res) => {
  const { username } = req.body;
  const { appid } = req.params;
  const { message, status} = await service.deleteUserFavorite(username, appid);
  return res.status(status).json({ message });
};

module.exports = { 
  getAll,
  findById,
  newFavorite,
  getUserFavorites,
  deleteUserFavorite,
};