<template>
	<div>			
 		<Select v-model="value" multiple  @on-change="durationChange" v-if="show" :placeholder="placeholder" placement="top" filterable clearable>
			<Option value="" key="" v-if="type">全部</Option>
			<Option :value="item.id" v-for="item in selectData">
				<Checkbox v-model="item.show">{{item.title}}</Checkbox>{{item.name}}
			</Option>
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
			console.log(this.newItem)	  
			this.value = this.newItem.map(item=>{
				return item.id
			})	  
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
								let newdata = _this.newItem    
								    data.forEach((a)=>{
											a.title = " "
											a.show = false;
										}) 
								  if(newdata && newdata.length>0){
										newdata.forEach((a)=>{
											var idx = 0
											data.forEach((b)=>{
												if(a.id == b.id ){
													b.show = true;
													idx = 1
												}
											})
											if(idx == 0){
												var newData = a;
												    newData.show = true
												data.push(newData)
											}
										})
									} 					
								_this.items =  data
								_this.show = true
            }
        })
      },
			durationChange(){ 		 
				let _this = this;
				setTimeout(() => {
					let data = this.selectData.filter(item=>item.show==true)
          _this.$emit("emitmaintainer",data)
				}, 50);
			}
		}
	}
</script>
