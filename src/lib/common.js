import CryptoJS from 'crypto-js'
import store from 'store'

exports.convertBase64StrToArray = function(base64Str) {
  let bytes = window.atob(base64Str) // 去掉url的头，并转换为byte
  // 处理异常,将ascii码小于0的转换为大于0
  let ab = new ArrayBuffer(bytes.length)
  let ia = new Uint8Array(ab)
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i)
  }
  return ab
}

exports.aesEncryptModeCFB = function(msg, pwd) {
  let magicNo = exports.generateRandomAlphaNum(32)

  let key = CryptoJS.enc.Hex.parse(CryptoJS.MD5(pwd).toString())
  let iv = CryptoJS.enc.Hex.parse(magicNo)

  let identifyCode = CryptoJS.AES.encrypt(msg, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).toString()
  return [magicNo, identifyCode]
}

exports.generateRandomAlphaNum = function(len) {
  let rdmString = ''
  // toSting接受的参数表示进制，默认为10进制。36进制为0-9 a-z
  for (; rdmString.length < len; ) {
    rdmString += Math.random()
      .toString(16)
      .substr(2)
  }
  return rdmString.substr(0, len)
}

exports.clearStoreData = function(key, value) {
  store.clearAll()
}

exports.setStoreData = function(key, value) {
  store.set(key, value)
}

function getStoreData(key) {
  return store.get(key)
}
exports.getStoreData = getStoreData

exports.removeStoreData = function(key) {
  store.remove(key)
}

exports.treeIconRender = (h, { root, node, data }, _self, treeRef, folderIcon, menuIcon) => {
  if (node.node.node_type === '00') {
    return h(
      'span',
      {
        style: {
          display: 'inline-block',
          width: '100%'
        }
      },
      [
        h('span', [
          h('Icon', {
            props: {
              type: folderIcon
            },
            style: {
              marginRight: '8px'
            }
          }),
          h(
            'span',
            {
              style: {
                color: '#666',
                cursor: 'pointer'
              },
              domProps: {
                className: 'treenode'
              },
              on: {
                click: e => {
                  let nodes = treeRef.$el.querySelectorAll('.treenode')
                  for (let i = 0; i < nodes.length; i++) {
                    nodes[i].style.backgroundColor = '#fff'
                  }
                  e.path[0].style.backgroundColor = '#2d8cf0' // 当前点击的元素
                  _self.actNode = JSON.parse(JSON.stringify(node.node))
                }
              }
            },
            data.title
          )
        ])
      ]
    )
  } else if (node.node.node_type === '01') {
    return h(
      'span',
      {
        style: {
          display: 'inline-block',
          width: '100%'
        }
      },
      [
        h('span', [
          h('Icon', {
            props: {
              type: menuIcon
            },
            style: {
              marginRight: '8px'
            }
          }),
          h(
            'span',
            {
              style: {
                color: '#666',
                cursor: 'pointer'
              },
              domProps: {
                className: 'treenode'
              },
              on: {
                click: e => {
                  let nodes = treeRef.$el.querySelectorAll('.treenode')
                  for (let i = 0; i < nodes.length; i++) {
                    nodes[i].style.backgroundColor = '#fff'
                  }
                  e.path[0].style.backgroundColor = '#2d8cf0' // 当前点击的元素
                  _self.actNode = JSON.parse(JSON.stringify(node.node))
                }
              }
            },
            data.title
          )
        ])
      ]
    )
  }
}

// exports.selectRender = (_self, key) => {
//   return (h, params) => {
//     let options = []
//     _self.pagePara[key].forEach(item => {
//       options.push(
//         h(
//           'Option',
//           {
//             props: {
//               value: item.id,
//               key: item.id
//             }
//           },
//           item.text
//         )
//       )
//     })
//     return h(
//       'Select',
//       {
//         props: {
//           value: params.row[params.column.key],
//           disabled: true
//         }
//       },
//       options
//     )
//   }
// }

// 因为效率问题
exports.selectRender = (_self, key) => {
  return (h, params) => {
    let text = ''
    for (let item of _self.pagePara[key]) {
      if (item.id === params.row[params.column.key]) {
        text = item.text
        break
      }
    }
    return h('span', {}, text)
  }
}

let tooltipFormat = value => {
  if (value.length > 8) {
    return value.substring(0, 5) + '...'
  } else {
    return value
  }
}

exports.tooltipRender = () => {
  return (h, params) => {
    return h(
      'Tooltip',
      {
        props: {
          trigger: 'hover',
          'max-width': 400,
          content: params.row[params.column.key]
        }
      },
      [
        h(
          'Button',
          {
            style: 'text-decoration:underline',
            props: {
              type: 'text'
            }
          },
          tooltipFormat(params.row[params.column.key])
        )
      ]
    )
  }
}
