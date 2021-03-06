let util = require('../../utils/util.js')
Page({
    data: {
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        heighttab: 48,
        loading: true,
        isHide: true,
        isLogin: true,
        season: 'spring',
        openid: '',
        tabCur: 0, //默认选中
        collects: [],
        bgcolor:'#72db95',
        tabs: [{
                name: '收藏',
                id: 0
            },
            {
                name: '设置',
                id: 1
            },
        ],
        setitems: [{
                text: '意见反馈',
                url: '/pages/opinion/opinion',
                icon: '../../images/personicon/spring-advice.png',
                tips: '',
                arrows: ''
            },
            {
                text: '关于我们',
                url: '/pages/about/about',
                icon: '../../images/personicon/spring-about.png',
                tips: '',
                arrows: ''
            },
            {
                text: '联系客服',
                fun: 'customersService',
                icon: '../../images/personicon/spring-service.png',
                tips: '',
                arrows: ''
            }
        ]
    },

    onLoad: function (options) {
        let that = this
        const app = getApp()
        this.setData({
            heighttab: wx.getStorageSync('heightTabbar')
        })
        this.isLogin()
        util.loadScreen(that,1000)
        util.setSeason(that)
        if(this.data.season !== 'spring') {
            this.setData({
                bgcolor:'#f3c3b0'
            })
        }
        this.setData({
            setitems: [{
                    text: '我的收藏',
                    url: '/pages/collects/collects',
                    icon: '../../images/personicon/' + app.globalData.season + '-collect.png',
                    tips: '',
                    arrows: ''
                }, {
                    text: '意见反馈',
                    url: '/pages/opinion/opinion',
                    icon: '../../images/personicon/' + app.globalData.season + '-advice.png',
                    tips: '',
                    arrows: ''
                },
                {
                    text: '关于我们',
                    url: '/pages/about/about',
                    icon: '../../images/personicon/' + app.globalData.season + '-about.png',
                    tips: '',
                    arrows: ''
                },
                {
                    text: '联系客服',
                    fun: 'customersService',
                    icon: '../../images/personicon/' + app.globalData.season + '-service.png',
                    tips: '',
                    arrows: ''
                }
            ]
        })
    },
    onShow() {
        this.changeIcon()
        this.isLogin()
    },
    openSetting() {
        if (this.data.isLogin) {
            wx.openSetting()
        } else {
            wx.showToast({
                title: '请先登录',
                icon: 'none',
                duration: 1500
            })
        }
    },
    login() {
        console.log(1)
        wx.getUserProfile({
                desc: '用户完善会员资料',
            })
            .then(res => {
                wx.showToast({
                    title: '登录成功',
                    icon: 'success',
                    duration: 2000
                })
                wx.setStorageSync('userInfo', res.userInfo)
                wx.cloud.callFunction({
                    name: 'login',
                }).then(res => {
                    this.setData({
                        openid: res.result.openid
                    })
                    this.getCollects(res.result.openid)
                    wx.setStorageSync('openid', res.result.openid)
                })
                this.setData({
                    isLogin: true,
                    userImg: res.userInfo.avatarUrl,
                    userName: res.userInfo.nickName
                })

            })
            .catch(err => {
                console.log("用户拒绝了微信授权登录", err);
            })
    },
    outLog() {
        wx.showModal({
            title: '提示',
            content: '是否退出当前账号'
        }).then(res => {
            if (res.confirm) {
                this.setData({
                    isLogin: false,
                    userImg: '',
                    userName: ''
                })
                wx.clearStorage()
            } else if (res.cancel) {

            }
        })
    },
    tabSelect(e) {
        this.setData({
            tabCur: e.currentTarget.dataset.id,
            scrollLeft: (e.currentTarget.dataset.id - 2) * 200
        })
    },
    getCollects(openid) {
        wx.cloud.database().collection('collects').where({
                _openid: openid
            }).get()
            .then(res => {
                this.setData({
                    collects: res.data
                })
            })
    },
    isLogin() {
        let userInfo = wx.getStorageSync('userInfo')
        if (userInfo) {
            let openid = wx.getStorageSync('openid')
            this.setData({
                isLogin: true,
                userImg: userInfo.avatarUrl,
                userName: userInfo.nickName
            })
            this.getCollects(openid)
        } else {
            wx.showToast({
                title: '未登录',
                icon: 'none',
                duration: 1500
            })
            this.setData({
                isLogin: false
            })
        }
    },
    goBook(e) {
        wx.cloud.database().collection('bookintro').where({
            title: e.currentTarget.dataset.name
        }).get().then(res => {
            wx.navigateTo({
                url: '../details/details?id=' + res.data[0]._id + '&title=' + e.currentTarget.dataset.name
            })
        })
        console.log(e.currentTarget.dataset.cId)


    },
    // 解决需要点击两次 tabbar 图标才会变换
    changeIcon() {
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().setData({
                selected: 3
            })
        }
    },
    customersService(e) {
        console.log(e.target.dataset)
        const {
            unshow
        } = e.target.dataset;
        console.log(unshow)
        this.setData({
            contact: !unshow ? true : false
        })
    }
})