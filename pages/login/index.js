// pages/login/index.js
import wxutil from '../../miniprogram_npm/@yyjeffrey/wxutil/index'
import { Auth } from '../../models/auth'
const app = getApp()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Component({
  
  /**
   * 组件的属性列表
   */
  properties: {


  },

  /**
   * 组件的初始数据
   */
  data: {
    avatarUrl: defaultAvatarUrl,
    nickName: '',
    code: null,
    goto: null
  },

  onLoad(options) {
    console.log("onLoad")
    if (options.goto) {
      this.setData({
        goto: decodeURIComponent(options.goto)
      })
    }
  },

  
 
  /**
   * 组件的方法列表
   */
  methods: {
    getCode() {
      console.log("getcode")
      wx.login({
        success: (res) => {
          console.log(res.code);
          this.setData({
            code: res.code
          })
        }
      })
    },
    onChooseAvatar(e) {
      const { avatarUrl } = e.detail 
      this.setData({
        avatarUrl,
      })
    },
    bindKeyInput(e) {
      this.setData({
        nickName: e.detail.value
      })
    },
    async auth() {
      app.globalData.userDetail = null
      this.getCode()
      const data = {
        code: this.data.code,
        nickName: this.data.nickName,
        avatar: this.data.avatarUrl
      }
      const info = await Auth.initiative(data)
      if (info.code === 0) {
        const userDetail = info.data
        wxutil.setStorage('userDetail', userDetail)
        app.globalData.userDetail = userDetail

        wx.lin.showMessage({
          type: 'success',
          content: '授权成功',
          success: () => {
            if (this.data.goto) {
              wx.redirectTo({
                url: this.data.goto
              })
            } else {
              wx.navigateBack()
            }
          }
        })
      } else {
        wx.lin.showMessage({
          type: 'error',
          content: info.msg
        })
      }
    }
  }
})
