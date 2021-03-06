// pages/details/details.js
let util = require('../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabCur: 0, //默认选中
        tabs: [{
                name: '介绍',
                id: 0
            },
            {
                name: '目录',
                id: 1
            },
        ],
        lists: [],
        isCollect: false,
        loading: true
    },
    getintro(id) {
        console.log(id)
        wx.cloud.database().collection('bookintro').doc(id).get().then(res => {
            console.log(res)
            this.setData({
                title:res.data.title,
                img: res.data.img,
                intro: res.data.intro,
                introduce: res.data.introduce,
                lists: res.data.section,
                id:res.data.id
            })
            this.selectComponent('#preIntroduce').build();
        })
        wx.cloud.database().collection('bookintro')
    },
    goCont(e) {
        wx.navigateTo({
            url: '../cont/cont?title=' + this.data.title + '&&chapter=' + e.currentTarget.dataset.chapter,
        })
    },
    /**
     * 添加收藏函数
     * 1. 判断登录
     * 2. 调用添加接口为数据库添加收藏数据
     */
    // 防抖之后的收藏函数
    _debounceAc:function (){
        util.debounce(this.addCollect,1000)()
    },
    addCollect: function () {
        console.log("执行一次")
        let openid = wx.getStorageSync('openid')
        if (openid) {
            console.log(1)
            wx.cloud.database().collection('collects').add({
                data: {
                    title: this.data.title,
                    intro: this.data.intro,
                    img: this.data.img,
                    isCollect: true,
                },
                success: res => {
                    this.setData({
                        isCollect: true
                    })
                    wx.showToast({
                        title: '已加入收藏夹',
                    })
                },
                fail: err => {
                    console.log(err)
                }
            })
        } else {
            wx.showToast({
                title: '请先登录',
                icon: 'none',
                duration: 1500
            })
        }
    },
    /**
     * 移除收藏函数
     * 调用移除收藏接口
     * where：根据特定的键值对来对数据进行删除
     */
    removeCollect() {
        let openid = wx.getStorageSync('openid')
        wx.cloud.database().collection('collects').where({
            _openid: openid,
            title: this.data.title
        }).remove({
            success: res => {
                wx.showToast({
                    title: '取消收藏成功',
                })
                // 样式控制
                this.setData({
                    isCollect: false
                })
            }
        })
    },
    /**
     * 开始阅读函数
     */
    read() {
        wx.navigateTo({
            url: '../cont/cont?title=' + this.data.title + '&&chapter=' + '1',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        let app = getApp()
        let {
            id,
            title
        } = options;
        console.log(options)
        let openid = wx.getStorageSync('key')
        this.setData({
            id,
            title,
            openid,
            titleHeight:app.globalData.titleHeight
        })
        console.log(app.globalData.titleHeight)
        wx.cloud.database().collection('collects').where({
            _openid: openid
        }).get().then(res => {
            console.log(res.data)
            res.data.forEach(item => {
                console.log(this.data.title === item.title)
                console.log(this.data.title,item.title)
                if (this.data.title === item.title) {
                    this.setData({
                        isCollect: true
                    })
                }
            })

        })
        this.getintro(id)
        util.loadScreen(that, 300)
        util.setSeason(that)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
    tabSelect(e) {
        this.setData({
            tabCur: e.currentTarget.dataset.id,
            scrollLeft: (e.currentTarget.dataset.id - 2) * 200
        })
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})