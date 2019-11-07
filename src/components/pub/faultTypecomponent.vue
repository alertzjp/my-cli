<template>
	<div>
		<Select v-model="value" @on-change="durationChange(value)" @on-query-change="onquerychange" v-if="show" placeholder="选择报障类型">
      <Option value="">全部</Option>
			<OptionGroup :label="item.name" v-for="item in items">
					 <Option v-for="list in item.resourcesList" :value="list.id" :key="list.id">{{ list.name }}</Option>
			 </OptionGroup>
		</Select>
	</div>
</template>
<script>
	export default{
		props:{
      faulttype:{
        default:0
      },
    },
		data(){
			return{
				show:false,
        value:'',
				olditems:[],
        items:[]
			}
		},
		mounted() {
			let _this=this;
			setTimeout(function(){
	       _this.value=_this.faulttype;
	    },0)
			this.list()
    },
		methods:{
			onquerychange (e) {
				if(e==""){
					this.value = ""
					this.durationChange(e)
				}
			},
      list () {
        let _this = this;
        let data = {
              token:this.$webapi.get('token'),
							// pageNo:'1',
							// pageSize:"1000"
        }
        this.$api.get('/bicycleFaultType/set',data,reset => {
            if (reset.codeId === 1) {
							_this.olditems = reset.resData
							let cloneData = JSON.parse(JSON.stringify(reset.resData))    // 对源数据深度克隆
								let tree = cloneData.filter(father=>{              //循环所有项
									let branchArr = cloneData.filter(child=>{
										return father.id == child.parentId      //返回每一项的子级数组
									});
									if(branchArr.length>0){
										father.resourcesList = branchArr;    //如果存在子级，则给父级添加一个children属性，并赋值
									}
									return father.parentId==0;      //返回第一层
								});
                _this.items = tree
								_this.show = true
            }
        })
      },
			durationChange(e){
				let reset = {
					id:"",
					name:""
				}
				if(!e){
					this.value = ""
					this.$emit("emitfault",reset)
					return
				}
        this.olditems.forEach(function (a) {
           if(e == a.id){
             reset = a
           }
        })
        this.$emit("emitfault",reset)
			}
		}
	}
</script>
