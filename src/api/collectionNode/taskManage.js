import request from '@/utils/request'

const api = {
  list: '/gatherTask/getGatherTaskInfoBySiteId',
  actList: '/gatherTask/getActivateTaskBySite',
  add: '/gatherTask',
  // sendOne: '/gatherTask/updateTaskStatus',
  send: '/gatherTask/issueTask',
  connectSensor: '/gatherTask/getSensorsByTaskId'

}

export function getList(parameter) {
  return request({
    url: api.list,
    method: 'get',
    params: parameter
  })
}
export function getActList(parameter) {
  return request({
    url: api.actList,
    method: 'get',
    params: parameter
  })
}
export function getConnectSensor(parameter) {
  return request({
    url: api.connectSensor,
    method: 'get',
    params: parameter
  })
}
export function sendOne(parameter) {
  return request({
    url: api.send,
    method: 'get',
    params: parameter
  })
}
export function send(parameter) {
  return request({
    url: api.send,
    method: 'put',
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