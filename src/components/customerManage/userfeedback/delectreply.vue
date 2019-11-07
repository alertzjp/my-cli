<template>
  <div id="">
    <div class="">
      <Modal v-model="show" width="800" @on-cancel="cancel" :mask-closable="false">
         <p slot="header">
             <Icon type="information-circled"></Icon>
             <span>回复</span>
         </p>
         <div style="text-align:center;max-height:400px; overflow: auto;">
           <table-component :loading="loading" :columnsdata="columns" :datas="data"></table-component>
         </div>
         <div slot="footer">
         </div>
      </Modal>
    </div>
  </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
export default {
  name: "",
  components: {
    tableComponent
  },
  props: {
    selectItem:{
      default () {
        return ""
      }
    }
  },
  data () {
    return {
      title:'关联卡号',
      show:false,
      formItem:{
        feedbackId:'',
        reply:''
      },
      data:[],
      columns:[
        {
            title: '回复内容',
            key: 'reply',
            minWidth:250,
            render: (h, params) => {
              let str = params.row.reply
              if(params.row.show){
                return h('div', [
                    h('Input', {
                        props: {
                            type: 'primary',
                            value:params.row.reply
                        },
                        style: {
                            marginRight: '5px'
                        },
                        on: {
                          'on-blur': (e) => {
                              params.row.reply = e.target.value
                              this.data[params.index].reply = e.target.value
                          }
                        }
                    }, ''),
                    h('Button', {
                         props: {
                             type: 'primary',
                             size: 'small'
                         },
                         style: {
                             marginRight: '5px'
                         },
                         on: {
                             click: () => {
                                 params.row.show = false
                                 this.data[params.index].show = false
                             }
                         }
                     }, '取消'),
                     h('Button', {
                          props: {
                              type: 'primary',
                              size: 'small'
                          },
                          style: {
                              marginRight: '5px'
                          },
                          on: {
                              click: () => {
                                 params.row.show = false
                                 this.data[params.index].reply = params.row.reply
                                 this.save(params.row,params.index)
                              }
                          }
                      }, '保存')
                ]);
              }else {
                  return h('div', [
                      h('span', str)
                ])
              }
         }
        },
        {
            title: '操作人',
            key: 'answerer',
            minWidth:100,
        },
        {
            title: '回复日期',
            key: 'reply',
            minWidth:100,
            render: (h, params) => {
              let str = this.$webapi.gettime('time',(params.row.repliedAt)/1000)
              return h('div', [
                  h('span', str)
            ])
         }
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            minWidth:180,
            fixed:"right",
            render: (h, params) => {
              let _this = this;
                return h('div', [
                    h('Button', {
                        props: {
                            type: 'primary',
                            size: 'default'
                        },
                        style: {
                            marginRight: '5px',
                            display:_this.$hasPerm('/advice_reply/update')?(params.row.status!==1)?"":"none":"none"
                        },
                        on: {
                            click: () => {
                               params.row.show = true
                               _this.data[params.index].show =true
                            }
                        }
                    }, '编辑'),
                    h('Button', {
                        props: {
                            type: 'error',
                            size: 'default'
                        },
                        style: {
                            marginRight: '5px',
                            display:_this.$hasPerm('/advice_reply/delete')?(params.row.status!==1)?"":"none":"none"
                        },
                        on: {
                            click: () => {
                              _this.$webapi.getMessinfo({
                                title:"确定要删除？",
                                yes () {
                                  _this.advicedelete(params.row,params.index)
                                }
                              })
                            }
                        }
                    }, '删除'),
                ]);
            }
        }
      ],
      ruleInline:{
        reply: [
            { required: true, message: '回复内容没有填写', trigger: 'blur' },
            { type: 'string', min:1,max:200, message: '最小为1个字，最大200个字', trigger: 'blur' }
         ]
      },
      loading:false,
    }
  },
  mounted() {
    //do something after mounting vue instance
    this.formItem.feedbackId = this.selectItem.id
    let data = this.selectItem.adviceReplyList
        data.forEach((a)=>{
          a.oldreply = a.reply
          a.show = false
        })
    this.data = data
    this.show = true
  },
  methods: {
    save (e,index) {
      let data = {
        token:this.$webapi.get('token'),
        id:e.id,
        reply:e.reply
      }
      let _this = this
      this.$api.post("/advice_reply/update", data, reset => {
        if (reset.codeId === 1) {
             _this.$Message.info("编辑成功")
             _this.data[index].show = false
        }else {
          e.reply = e.oldreply
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    advicedelete (e,index) {
      let data = {
        token:this.$webapi.get('token'),
        id:e.id
      }
      let _this = this
      this.$api.post("/advice_reply/delete", data, reset => {
        if (reset.codeId === 1) {
             _this.$Message.info("删除成功")
             _this.data.splice(index,1)
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    handleSubmit (name) {
        let _this = this;
        this.$refs[name].validate((valid) => {
            if (valid) {
              _this.post()
            }
        })
    },
    cancel (e) {
      this.$emit("emitreplycomponent",e?true:false)
    },
    post () {
      this.loading = true
      let listdata = {
        token:this.$webapi.get('token'),
        feedbackId:this.formItem.feedbackId,
        reply:this.formItem.reply
      }
      let _this =  this
      this.$api.post('/advice_reply/add',listdata,reset => {
         _this.loading = false
        if (reset.codeId === 1) {
          _this.cancel(true)
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },

  }
}
</script>
<style lang="less" scoped>
</style>
