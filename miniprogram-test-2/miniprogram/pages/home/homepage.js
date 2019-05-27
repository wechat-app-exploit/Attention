// pages/home/homepage.js
import { $wuxCalendar } from '../../dist/index'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    avatarUrl: '/images/user_unlogin.png',
    logged: false,
    openid: '',


    value_calendar:[],
    //滑动删除
    right: [
      {
        text: 'Delete',
        style: 'background-color: #F4333C; color: white',
      }],

    //日程项
    sche_list: [],
  },

  onLoad: function (options) {
    let username = wx.getStorageSync('username');
    let avatarUrl = wx.getStorageSync('avatarUrl');
    let openid = wx.getStorageSync('openid');
    if (username) {
      this.setData({
        username: username,
        avatarUrl: avatarUrl,
        logged: true,
        openid: openid
      })
      app.globalData.openid = openid
    }
    

    const systerm_date = new Date();
    const db = wx.cloud.database({}); //获取数据库的引用
    const table = db.collection('schedule'); //获取该集合的引用
    let _this = this;

    this.setData({
      openid: wx.getStorageSync('openid')
    })

    table.where({
      _openid: openid
    }).get({ //时间越小越靠前
      success: res => {
        
        for (let i = res.data.length - 1; i >= 0; i--) {
          
          let date = res.data[i].due;
          
          if (!(date.getFullYear() == systerm_date.getFullYear() &&
            date.getMonth() == systerm_date.getMonth() &&
            date.getDay() == systerm_date.getDay())) {
            res.data.splice(i, 1);
          }else{
            let str_date = "";
            str_date += date.getFullYear()+"/";
            str_date += date.getMonth() + 1 + "/";
            str_date += date.getDate();
            res.data[i].date = str_date;

            let str_time = "";
            let hour = date.getHours();
            let minute = date.getMinutes();
            hour < 10 ? (hour = "" + "0" + hour) : (hour = "" + hour)
            minute < 10 ? (minute = "" + "0" + minute) : (minute = "" + minute)
            str_time += hour+":"+minute;
            console.log(str_time);
            res.data[i].time = str_time;
          }
        }
        
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].due = res.data[i].due.toLocaleDateString() + '  ' + res.data[i].due.toLocaleTimeString();
        }
        
        this.setData({
          sche_list: res.data
        })
      },
      fail: err => {
        console.log(err);
      }
    });
    
  },
 
 test: function() {
   console.log(this.data.openid);
 },
  addsche() {
    wx.navigateTo({
      url: '/pages/uploadpicture/uploadpicturepage',
    })
  }, 
  editsche() {
    wx.showModal({
      title: 'edit',
      content: 'click to edit',
    })
    wx.navigateTo({
      url: '/pages/uploadpicture/uploadpicturepage',
    })
  },
  deletesche(){
    wx.showModal({
      title: 'delete',
      content: 'click to delete',
    })
  },
  openCalendar() {
    $wuxCalendar().open({
      value: this.data.value_calendar,
      onChange: (values, displayValues) => {
        console.log('onChange', values, displayValues)
        this.setData({
          value_calendar: displayValues,
        })
      },
    })
  },
})