import { serialize } from 'object-to-formdata'
import config from './config'
export const API_URL = config.API_URL;
export default function fetchApi (endpoint, method, params, payload, contentType) {
  contentType = contentType || 'json'
  const paramsObject = new URLSearchParams(params)
  const paramsString = paramsObject.toString()
  return fetch(API_URL + endpoint + '?' + paramsString, {
    method: method || 'GET',
    headers: {
      ...contentType === 'json' && { 'Content-Type': 'application/json' }
    },
    body: contentType === 'json' ? JSON.stringify(payload) : serialize(payload)
  })
    .then(x => x.json().catch(() => ({})))
    .then(x => {
      if (x.error) throw new Error(x.message)
      return x
    })
}