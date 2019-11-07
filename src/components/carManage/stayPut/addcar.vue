<template>
  <div class="">
    <Modal v-model="show" width="660" @on-cancel="cancel" >
       <p slot="header">
           <Icon type="information-circled"></Icon>
           <span>{{this.title}}</span>
       </p>
       <div style="text-align:left">
         <Form ref="formCustom" :model="formCustom" :rules="ruleValidate" :label-width="120">
              <FormItem label="电子围栏:" prop="minInterval">
                   <fence-component @fenceEmitComponent="fenceEmitComponent"></fence-component>
              </FormItem>
              <FormItem label="起始二维码编号:" prop="minInterval">
                  <Input v-model="formCustom.minInterval" placeholder="起始二维码编号" />
              </FormItem>
              <FormItem label="末尾二维码编号:" prop="maxInterval">
                <Input v-model="formCustom.maxInterval" placeholder="末尾二维码编号" />
              </FormItem>
              <FormItem label="数量:" prop="amount">
                  <InputNumber :min="1" v-model="formCustom.amount"></InputNumber>
              </FormItem>
            <FormItem> 
                <Button type="primary" @click="handleSubmit('formCustom')">保存</Button>
                <Button type="error" @click="handleReset()" style="margin-left: 8px">取消</Button>
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
import fenceComponent from '../../pub/fencelistcommon.vue'
export default {
  name: "",
  props:{
    putinshow:{
      default:true
    },
    setitem:{
      default:()=>{}
    }
  },
  components:{
    tableComponent,
    pageComponent,
    fenceComponent
  },
  data () {
    return {
      title:"投放车辆",
      loading:false,
      show:true,
      formCustom:{
        fenceId:"",
        maxInterval:"",
        minInterval:"",
        amount:null
      },
      pageData:{
         totalCount:1,
         pageCurrent:1,
         pagesize:10,
     },
      ruleValidate:{
         minInterval: [
          { required: true, message: '起始二维码编号没有填写', trigger: 'blur' }
        ],
        maxInterval: [
          { required: true, message: '末尾二维码编号没有填写', trigger: 'blur' }
        ],

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
    this.eshow = this.putinshow;
  },
  watch:{
    putinshow:{
      handler (val,oldval) {
        this.eshow = val
      },
      deep:true
    }
  },
  methods: {
      cancel () {
        this.$emit("emitsectioncomponent")
      },
      fenceEmitComponent (e) {
        this.formCustom.fenceId = e.id
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
        if(!this.formCustom.amount){
           this.$Message.warning('投放数量没有填写');
           return;
        }
        let listdata = {
            data:JSON.stringify({
              token:this.$webapi.get('token'),
              fenceId:this.formCustom.fenceId,
              amount:""+this.formCustom.amount,
              minInterval:this.formCustom.minInterval,
              maxInterval:this.formCustom.maxInterval
            })
        }
        let _this = this
        this.$api.post("/bike/intervalputin", listdata, reset => {
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
