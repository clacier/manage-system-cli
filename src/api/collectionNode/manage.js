import request from '@/utils/request'

const api = {
  list: '/supplier/query',
  add: '/gatherSite'
}
// 供应商列表
export function getList(parameter) {
  return request({
    url: api.list,
    method: 'get',
    params: parameter
    // hideLoading: true
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
