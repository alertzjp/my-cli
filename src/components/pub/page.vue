<template>
	<div class="page">
		 <Page
		 :total="this.pagedata.totalCount"
		 :current="this.pagedata.pageCurrent"
		 :page-size="this.pagedata.pagesize"
		 @on-change="onChange"
		 @on-page-size-change="onpagesizechange"
		 :show-sizer="showsizer==1"
		 show-total
		 show-elevator
		 :page-size-opts="pagedata.arrPageSize"
		 ></Page>
	</div>
</template>
<script>
	import {vm} from '../../js/infobase/vm.js'
    export default {
		props:{
			pageData:{
				default () {
					return {}
				}
			},
			showsizer:{
				default () {
					return 1
				}
			}
		},
		mounted: function () {
			this.pagedata.totalCount = this.pageData.totalCount || 0
			this.pagedata.pagesize = this.pageData.pagesize || 10
			this.pagedata.pageCount = this.pageData.totalPage || 0
			this.pagedata.pageCurrent = this.pageData.pageCurrent || 1
     },
	    data(){
	    	return{
		  	    	// 分页
		       pagedata:{
								//分页数
								arrPageSize:[3,5,10,15,20],
								//分页大小
								pagesize:0,
								//总分页数
								pageCount:0,
								//当前页面
								pageCurrent:0,
								//总数
								totalCount:0
		         }
	      	}
        },
				watch:{
						"pageData.totalCount":function (e) {
							this.pagedata.totalCount = this.pageData.totalCount
						},
						"pageData.pageCurrent":function (e) {
							this.pagedata.pageCurrent = this.pageData.pageCurrent
						},
						"pageData.pageCount":function (e) {
							console.log("pageData.pageCount")
							this.pagedata.pageCount = this.pageData.pageCount
						},
						"pageData.pagesize":function (e) {
							this.pagedata.pagesize = this.pageData.pagesize
						},
						// pageData:{
						// 	handler(curVal,oldVal){
						// 		this.pagedata.totalCount = curVal.totalCount
						// 		this.pagedata.pagesize = curVal.pagesize
						// 		this.pagedata.pageCount = curVal.totalPage
						// 		this.pagedata.pageCurrent = curVal.pageCurrent
						//  	},
					  //   deep:true
						// }
				},
        methods:{
			  onpagesizechange (pagesize) {
					  if(pagesize){
							this.pagedata.pageCurrent = 1
							this.pagedata.pagesize = pagesize
							this.$emit('pageComponentDate',this.pagedata);
						}
	     		},
      	onChange:function(curpage){
				  if(curpage){
						this.pagedata.pageCurrent = curpage
						this.$emit('pageComponentDate',this.pagedata)
					}
         }
       }
    }
</script>
<style scoped>
	.page{
		margin-top: 18px;
		margin-bottom: 18px;
		text-align:center;
	}
</style>
