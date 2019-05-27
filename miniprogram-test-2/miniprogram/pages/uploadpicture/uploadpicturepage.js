// pages/uploadpicture/uploadpicturepage.js
import { $wuxCalendar } from '../../dist/index'
import { $wuxSelect } from '../../dist/index'

Page({
  data: {
    value_hour: '07',
    title_hour: '07',
    value_minute: '00',
    title_minute: '00',
    value_priority: '1星',
    title_priority: '1星',

    value_calendar: [],
    //表单数据
    title: "",
    date: "",
    content: "",
    priority: "",
    fileList: [{
      //添加上传文件 此时为默认
      uid: 0,
      status: 'uploading',
      url: 'https://wux.cdn.cloverstd.com/qrcode.jpg',
    },

    ],
  },
  onChange(e) {
    console.log('onChange', e)
    const { file } = e.detail

    this.setData({
      imageUrl: file.url,
    })

  },
  onSuccess(e) {
    console.log('onSuccess', e)
  },
  onFail(e) {
    console.log('onFail', e)
  },
  onComplete(e) {
    console.log('onComplete', e)
    wx.hideLoading()
  },

  onPreview(e) {
    console.log('onPreview', e)
    const { file, fileList } = e.detail
    wx.previewImage({
      current: file.url,
      urls: fileList.map((n) => n.url),
    })
  },
  onRemove(e) {
    const { file, fileList } = e.detail
    wx.showModal({
      content: '确定删除？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            fileList: fileList.filter((n) => n.uid !== file.uid),
          })
        }
      },
    })
  },
  onSave(e) {
    let title = e.detail.value.title;
    if(title == ''){
      wx.showToast({
        title: '日程主题不能为空',
        icon: 'none',
        duration: 1500
      })
    }else if(this.data.value_calendar[0] == undefined){
      wx.showToast({
        title: '请选择日期',
        icon: 'none',
        duration: 1500
      })
    }else{
      let content = e.detail.value.content;
      let due = new Date(this.data.value_calendar[0] + " " + this.data.value_hour + ":" + this.data.value_minute+":00");
      let priority = (Number)(this.data.value_priority.substring(0, 1))-1;
      console.log(priority);

      const db = wx.cloud.database({}); //获取数据库的引用
      const table = db.collection('schedule'); //获取该集合的引用

      table.add({
        data:{
          content: content,
          due: due,
          priority: priority,
          status: 0,
          title: title
        },
        success(res) {
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
          console.log(res)
        }
      })
      

    }
    // wx.showModal({
    //   content: "click to save",
    // })
  },
  openCalendar() {
    $wuxCalendar().open({
      value: this.data.value_calendar,
      onChange: (values, displayValues) => {
        console.log('onChange', values, displayValues)
        this.setData({
          value_calendar: displayValues,
        });
      },
    })
  },

  onClick_hour() {
    $wuxSelect('#wux-select1').open({
      value: this.data.value_hour,
      options: [
        '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12',
        '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'
      ],
      onConfirm: (value, index, options) => {
        console.log('onConfirm', value, index, options)
        if (index !== -1) {
          this.setData({
            value_hour: value,
            title_hour: options[index],
          })
        }
      },
    })
  },
  onClick_minute() {
    $wuxSelect('#wux-select2').open({
      value: this.data.value_minute,
      options: [
        '00', '01', '02', '03', '004', '05', '06', '07', '08', '09', '10', '11', '12',
        '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24',
        '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38',
        '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52',
        '53', '54', '55', '56', '57', '58', '59'
      ],
      onConfirm: (value, index, options) => {
        console.log('onConfirm', value, index, options)
        if (index !== -1) {
          this.setData({
            value_minute: value,
            title_minute: options[index],
          })
        }
      },
    })
  },
  
  onClick_priority() {
    $wuxSelect('#wux-select2').open({
      value: this.data.value_priority,
      options: [
        '1星','2星','3星','4星','5星'
      ],
      onConfirm: (value, index, options) => {
        console.log('onConfirm', value, index, options)
        if (index !== -1) {
          this.setData({
            value_priority: value,
            title_priority: options[index],
          })
        }
      },
    })
  },
})


