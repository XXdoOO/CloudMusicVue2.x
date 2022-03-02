/**
 * 手机或邮箱登录
 * @param {选项，phone或email} option 
 * @param {密码} password 
 * @returns 
 */
function loginURL(option, password) {
  return `/login/${option}?${option}=${option}&password=${password}?time=${Date.parse(new Date())}`;
}

// 退出登录
const LOGOUT_URL = `/logout?time=${Date.parse(new Date())}`;

// 登录状态
const STATUS_URL = `/login/status?time=${Date.parse(new Date())}`;

/**
 * 搜索
 * @param {关键词} keywords 
 * @returns 
 */
function searchURL(keywords){
  return `/search?keywords=${keywords}`;
}

/**
 * 歌曲歌词
 * @param {歌曲id} id 
 * @returns 
 */
function lyricURL(id){
  return `/lyric?id=${id}`;
}

/**
 * 喜欢音乐
 * @param {歌曲id} id 
 * @param {true为喜欢，false为取消喜欢} like 
 * @returns 
 */
function likeURL(id, like){
  return `/like?id=${id}&like=${like}`;
}


/**
 * 下载歌曲
 * @param {歌曲id} id 
 * @returns 
 */
function downloadURL(id) {
  return `/song/download/url?id=${id}`;
}

/**
 * 歌单所有歌曲
 * @param {歌单id} id 
 * @returns 
 */
function allSongURL(id) {
  return `/playlist/track/all?id=${id}&time=${Date.parse(new Date())}`;
}

/**
 * 歌曲url
 * @param {歌曲id} id 
 * @returns 
 */
function songURL(id) {
  return `/song/url?id=${id}`;
}

/**
 * 用户所有歌单
 * @param {用户uid} uid 
 * @returns 
 */
function allPlaylistURL(uid) {
  return `/user/playlist?uid=${uid}&time=${Date.parse(new Date())}`;
}

export default { loginURL, LOGOUT_URL, STATUS_URL, searchURL, lyricURL, likeURL, allSongURL, songURL, allPlaylistURL, downloadURL };