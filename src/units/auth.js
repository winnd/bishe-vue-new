import Cookies from 'js-cookie'

const LoginKey = 'hasLogin'

export function hadLogin () {
  return Cookies.get(LoginKey)
}

export function setLoginStatus () {
  return Cookies.set(LoginKey, '1')
}

export function resetLoginStatus () {
  return Cookies.remove(LoginKey)
}
