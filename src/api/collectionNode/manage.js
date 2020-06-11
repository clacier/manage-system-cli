import request from '@/utils/request'

const api = {
  list: '/gatherSite/page',
  add: '/gatherSite',

}

export function getList(parameter) {
  return request({
    url: api.list,
    method: 'get',
    params: parameter
  })
}
export function add(data) {
  return request({
    url: api.add,
    method: 'post',
    data: data
  })
}
export function edit(data) {
  return request({
    url: api.add,
    method: 'put',
    data: data
  })
}
export function deleteNode(data) {
  return request({
    url: api.add,
    method: 'DELETE',
    params: data
  })
}