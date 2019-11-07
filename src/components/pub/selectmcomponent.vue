<template>
	<div>
		{{selectData}}
 		<Select v-model="value" multiple  @on-change="durationChange(value)" v-if="show" :placeholder="placeholder" filterable clearable>
			<Option value="" key="" v-if="type">全部</Option>
			<Option :value="item.id" v-for="item in items">
				<Checkbox v-model="item.show">Checkbox</Checkbox>	{{item.name}}</Option>
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
        value:[],
        items:[]
			}
		},
		computed: {
			selectData () {
				let data = this.items;
				    data.forEach((a)=>{
							a.show = false;
						})
				    if(this.value && this.value.length>0){
							 this.value.forEach((a)=>{
								 data.forEach((b)=>{
									 	if(b.id == a){
											 b.show = true;
										 }
								 })
							 })
						}
				return data
			}
		},
		mounted() {
      //do something after mounting vue instance
			this.value = this.newItem		 
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
								let data  = reset.resData.list
								    data.forEach((a)=>{
											a.show = false;
										}) 
								_this.items = reset.resData.list
							 						 
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
