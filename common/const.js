const host = "127.0.0.1:3000";
// const host = "shu6.xyz";
const regExp = {
  username: /^[a-zA-Z0-9_]{3,15}$/,
  password: /^.{3,15}$/
}
module.exports = {
  host,
  regExp
}
