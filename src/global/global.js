/**
 * 手机或邮箱登录
 * @param {string} 选项，phone或email 
 * @param {string} 密码 
 * @returns 
 */
function loginURL(option, password) {
  return `/login/${option}?${option}=${option}&password=${password}?time=${new Date().getTime()}`;
}

// 退出登录
const LOGOUT_URL = `/logout?time=${new Date().getTime()}`;

// 登录状态
const STATUS_URL = `/login/status?time=${new Date().getTime()}`;

// 刷新登录状态
const REFRESH_STATUS_URL = `/login/refresh?time=${new Date().getTime()}`;

// 精品歌单
const RECOMMEND_URL = `/top/playlist/highquality`;

// 排行榜
const TOP_URL = `/toplist`;

/**
 * 搜索
 * @param {string} 关键词 
 * @returns 
 */
function searchURL(keywords){
  return `/search?keywords=${keywords}`;
}

/**
 * 歌曲歌词
 * @param {number} 歌曲id 
 * @returns 
 */
function lyricURL(id){
  return `/lyric?id=${id}`;
}

/**
 * 喜欢音乐
 * @param {number} 歌曲id 
 * @param {boolean} true为喜欢，false为取消喜欢 
 * @returns 
 */
function likeURL(id, like){
  return `/like?id=${id}&like=${like}`;
}


/**
 * 下载歌曲
 * @param {number} 歌曲id
 * @returns 
 */
function downloadURL(id) {
  return `/song/download/url?id=${id}`;
}

/**
 * 歌单所有歌曲
 * @param {number} 歌单id
 * @returns 
 */
function allSongURL(id) {
  return `/playlist/track/all?id=${id}&time=${Date.parse(new Date())}`;
}

/**
 * 歌曲url
 * @param {number} 歌曲id
 * @returns 
 */
function songURL(id) {
  return `/song/url?id=${id}`;
}

/**
 * 用户所有歌单
 * @param {number} 用户uid
 * @returns 
 */
function allPlaylistURL(uid) {
  return `/user/playlist?uid=${uid}&time=${Date.parse(new Date())}`;
}


export default { loginURL, LOGOUT_URL, STATUS_URL, REFRESH_STATUS_URL, RECOMMEND_URL,TOP_URL,  searchURL, lyricURL, likeURL, allSongURL, songURL, allPlaylistURL, downloadURL };