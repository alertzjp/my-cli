<template>
  <div class="">
    <Modal v-model="show" width="660" @on-cancel="cancel" >
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>{{this.title}}</span>
       </p>
       <div style="text-align:left">
         <Form ref="formCustom" :model="formCustom" :rules="ruleValidate" :label-width="120">
           <FormItem label="计费(元/小时):" prop="timeCharge">
               <Input v-model="formCustom.timeCharge" placeholder="计费(元/小时)" />
           </FormItem>
           <FormItem label="每日封顶(元/日):" prop="maxCharge">
             <Input v-model="formCustom.maxCharge" placeholder="每日封顶(元/日)" />
           </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formCustom')">保存</Button>
                <Button type="error" @click="handleReset('')" style="margin-left: 8px">取消</Button>
            </FormItem>
        </Form>
       </div>
       <div slot="footer">
       </div>
    </Modal>
  </div>
</template>
<script>
import tableComponent from '../../pub/tablecommon.vue'
import pageComponent from '../../pub/page.vue'
import bikeModelComponent from '../../pub/bikebomcomponent.vue'
import fenceComponent from '../../pub/fencelistcommon.vue'
const pricepass = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('Please enter your password'));
    } else {
        if (this.formCustom.passwdCheck !== '') {
            // 对第二个密码框单独验证
            this.$refs.formCustom.validateField('passwdCheck');
        }
        callback();
    }
};
export default {
  name: "",
  props:{
    selectItem:{
      default:()=>{}
    }
  },
  components:{
    tableComponent,
    pageComponent,
    bikeModelComponent,
    fenceComponent
  },
  data () {
    return {
      title:"修改计费规则",
      loading:false,
      show:false,
      formCustom:{
        id:"",
        maxCharge:"",
        timeCharge:"",
      },
      pageData:{
         totalCount:1,
         pageCurrent:1,
         pagesize:10,
     },
      ruleValidate:{
      },
      data:[],
      columns:[
          {
              title: '电子围栏',
              key: 'fenceName',
              align: 'center',
              minWidth:150,
          },
          {
              title: '停靠点',
              key: 'dockSiteName',
              align: 'center',
              minWidth:150,
          },
          {
              title: '操作',
              key: 'action',
              minWidth:180,
              align: 'center',
              render: (h, params) => {
                let _this = this;
                  return h('div', [
                    h('Button', {
                       props: {
                           type: 'primary',
                           size: 'default'
                       },
                       style: {
                           marginRight: '5px'
                       },
                       on: {
                           click: () => {
                             _this.select(params.row)
                           }
                       }
                     }, '选择'),
                  ]);
              }
          }
      ]
    }
  },
  mounted() {
    //console.log(this.selectItem)
    this.formCustom.id = this.selectItem.id || ""
    this.formCustom.maxCharge = this.selectItem.maxCharge || ""
    this.formCustom.timeCharge = this.selectItem.timeCharge || ""
    this.show = true
  },
  methods: {
      EmitbomComponent (e) {
        this.formCustom.bikeType = e.bikeType
        this.formCustom.bikeModelId = e.id
      },
      cancel () {
        this.$emit("emitchargecomponent")
      },
      fenceEmitComponent (e) {
        this.formCustom.fenceId = e.id
      },
      pageComponentDate(e){
        this.pageData.pageCurrent=e.pageCurrent;
        this.pageData.pagesize=e.pagesize;
        this.list();
      },
      handleSubmit (name) {
        let _this = this;
        this.$refs[name].validate((valid) => {
            if (valid) {
                _this.addrolepost()
            }
        })
       },
      addrolepost () {
        if(this.formCustom.maxCharge==""){
          this.$Message.info("计费(没有填写")
          return
        }
        if(this.formCustom.timeCharge==""){
          this.$Message.info("每日封顶没有填写")
          return
        }
        let listdata = {
          data:JSON.stringify({
            token:this.$webapi.get('token'),
            bicycleChargerule:{
              id:this.formCustom.id,
              maxCharge:this.formCustom.maxCharge,
              timeCharge:this.formCustom.timeCharge
            }
          })
        }
        let _this = this
        this.$api.post("/bicycleChargerule/update", listdata, reset => {
          if (reset.codeId == 1) {
            _this.cancel()
          }else {
            _this.$netcode.getApiCode(reset)
         }
        })
      },
      handleReset (name) {
        this.cancel()
      }
   }
}
</script>
<style lang="less" scoped>
</style>
