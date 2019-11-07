<template>
  <div class="">
    <div class="getResourceAll">
       <div class="resourcelist" v-for="(item,itemindex) in itemdata" style="margin-bottom:20px">
          <div class="resourcelist-hd" style="margin-bottom:10px">
             <span @click="first(item,itemindex)"><Checkbox v-model="item.checkedshow" size="large"></Checkbox></span>{{item.name}}
          </div>
          <div class="resourcelist-bd">
              <div class="resourcelist" style="margin-left:20px;margin-bottom:10px" v-for="(itemrole,index) in item.resourcesList">
                 <div class="resourcelist-hd" style="margin-bottom:10px" >
                  <span @click="second(itemrole,item,index)"><Checkbox v-model="itemrole.checkedshow" size="large"></Checkbox></span>{{itemrole.name}}
                 </div>
                 <div class="resourcelist-bd" style="margin-left:30px;margin-bottom:5px" v-if="itemrole.resourcesList.length>0" >
                     <div v-for="itemrolelist in itemrole.resourcesList" style="margin-bottom:10px">
                        <span @click="three(itemrolelist,index,itemindex)"><Checkbox v-model="itemrolelist.checkedshow" size="large"></Checkbox>{{itemrolelist.name}}</span>
                     </div>
                 </div>
              </div>
          </div>
          <Divider />
       </div>
   </div>
   <div class="" style="text-align: center;margin:15px 0">
     <span @click="save()" >
       <Button type="success" :loading="loadiing" size="large">保存</Button>
     </span>
   </div>
  </div>
</template>
<script>
export default {
  name: 'Ressource',
  created() {
    //do something after creating vue instance
    this.subfrom.roleId = this.$route.query.roleId
    this.list()
  },
  data () {
    return {
        subfrom:{
            roleId:""
        },
        loadiing:false,
        itemdata:[],
        newitemdata:{
          roleResources:[]
        }
    }
  },
  methods:{
    first (item,index) {
      let show =  item.checkedshow = !item.checkedshow
      item.resourcesList.forEach(function (list) {
          list.checkedshow = show
          if(list.resourcesList.length>0){
             list.resourcesList.forEach(function (itemlist) {
               itemlist.checkedshow = show
             })
          }
      })
    },
    second (itemrole,item,index) {
      let show =  itemrole.checkedshow = !itemrole.checkedshow
      if(itemrole.resourcesList.length>0){
         itemrole.resourcesList.forEach(function (itemlist) {
           itemlist.checkedshow = show
         })
      }
      //判断上一级
      let num = 0
      item.resourcesList.forEach(function (itemlist) {
          if(itemlist.checkedshow){
             num = num + 1
          }
      })
      if(num>0){
          item.checkedshow = true
      }else if(num == 0){
         item.checkedshow = false
      }
    },
    three (itemrolelist,index,itemindex) {
        let show =  itemrolelist.checkedshow = !itemrolelist.checkedshow
        let num = 0
        this.itemdata[itemindex].resourcesList[index].resourcesList.forEach(function (itemlist) {
            if(itemlist.checkedshow){
                 num = num + 1
            }
        })
        if(num>0){
            this.itemdata[itemindex].checkedshow = true
            this.itemdata[itemindex].resourcesList[index].checkedshow = true
        }else if(num == 0){
          let strnum = 0
           this.itemdata[itemindex].resourcesList[index].checkedshow = false
           this.itemdata[itemindex].resourcesList.forEach(function (itemlist) {
               if(itemlist.checkedshow){
                  strnum = strnum + 1
               }
           })
           if(num == 0){
             this.itemdata[itemindex].checkedshow  = false
           }
        }
    },
    list () {
      let _this = this;
       let data = {
          token:this.$webapi.get('token'),
          roleId:this.subfrom.roleId
      }
      this.$api.get("/roleResources/list", data, reset => {
        if (reset.codeId === 1) {
            let data = reset.resData
            data.forEach(function(itemlist){
              if(itemlist.show==1){
                itemlist.checkedshow = true
              }else{
                itemlist.checkedshow = false
              }
              if(itemlist.resourcesList.length>0){
                itemlist.resourcesList.forEach(function (item) {
                  if(item.show==1){
                    item.checkedshow = true
                  }else{
                    item.checkedshow = false
                  }
                  if(item.resourcesList.length>0){
                    item.resourcesList.forEach(function (enditem) {
                      if(enditem.show==1){
                        enditem.checkedshow = true
                      }else{
                        enditem.checkedshow = false
                      }
                    })
                  }
                })
              }
            })
            _this.itemdata = data
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    },
    save () {
      let _this = this
      let data = {
          roleResources:[]
      }
      // {roleResources:[{roleId:28,resourcesId:1},{roleId:28,resourcesId:2}]}
        this.itemdata.forEach(function (itemlist) {
           if(itemlist.checkedshow){
              let itemdata = {
                  roleId:parseInt(_this.subfrom.roleId),
                  resourcesId:itemlist.id
              }
              data.roleResources.push(itemdata)
           }
           if(itemlist.resourcesList.length>0){
             itemlist.resourcesList.forEach(function (item) {
               if(item.checkedshow){
                  let itemdata = {
                      roleId:parseInt(_this.subfrom.roleId),
                      resourcesId:item.id
                  }
                  data.roleResources.push(itemdata)
                  if(item.resourcesList.length>0){
                    item.resourcesList.forEach(function (itemthree) {
                      if(itemthree.checkedshow){
                         let itemdata = {
                             roleId:parseInt(_this.subfrom.roleId),
                             resourcesId:itemthree.id
                         }
                         data.roleResources.push(itemdata)
                      }
                   })
                  }
                }
             })
           }
        })
        this.newitemdata = data
        if(data.roleResources.length<1){
            this.$Message.error('资源信息至少选择一个才能保存')
        }else{
            this.saveemit()
        }
    },
    saveemit () {
      let _this = this
      // let url = "/admin_role/editor?token=" + this.$webapi.get('token') + " &data=" + JSON.stringify(this.newitemdata)
      let datas={
        token:this.$webapi.get('token'),
        data:JSON.stringify(this.newitemdata)
      }
      _this.loadiing = true
      this.$api.post("/roleResources/editor", datas, reset => {
        _this.loadiing = false
        if (reset.codeId === 1) {
           _this.$router.push({path:"/admin/system/role/list"})
        }else {
          _this.$netcode.getApiCode(reset)
       }
      })
    }
  }
}
</script>

<style>
  .getResourceAll{
    padding: 10px;
  }
  .resourcelist{
    text-align: left
  }
</style>
