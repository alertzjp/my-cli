<template>
	<div>
 		<Select v-model="value" @on-change="durationChange(value)" v-if="show" :placeholder="placeholder" filterable clearable>
			<Option value="" key="" v-if="type">全部</Option>
			<Option :value="item.id" v-for="item in items">{{item.name}}</Option>
		</Select>
	</div>
</template>
<script>
	export default{
		props:{
      navID:{
        default:0
      },
			propsid:{
        default:0
			},
			newItem:{
				default () {
					return []
				}
			},
			placeholder:{
				default () {
					return "选择维护人员"
				}
			},
			type:{
				default:''
			}
    },
		data(){
			return{
				show:false,
        value:"",
        items:[]
			}
		},
		mounted() {
      //do something after mounting vue instance
			this.value=this.propsid
			// let _this=this;
			// setTimeout(function(){
	    //    _this.value=_this.propsid?_this.propsid:"";
			// },0) 
 			this.list()
    },
		methods:{
      list () {
        let _this = this;
        let data = {
            data:{
							pageNo:"1",
							pageSize:"10000",
              token:this.$webapi.get('token'),
            }
        }
        this.$api.get('/maintain/maintainerlistNoDistrict',data,reset => {
            if (reset.codeId === 1) {
								_this.items = reset.resData.list
								_this.items = _this.items.concat(_this.newItem)								 
								_this.show = true
            }
        })
      },
			durationChange(e){
        let reset = {}
        this.items.forEach(function (a) {
           if(e == a.id){
             reset = a
           }
        })
        this.$emit("emitmaintainer",reset)
			}
		}
	}
</script>
