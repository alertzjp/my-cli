<template>
  <div id="">
    <DatePicker
      type="daterange"
      placement="bottom"
      placeholder="选择起始时间"
      @on-change="changetime"
      :options="options"
      :value="timearr"
      format="yyyy-MM-dd"
      v-if="type==1"
         >
   </DatePicker>
   <DatePicker type="daterange" :options="options2" :value="timearr" placeholder="选择起始时间" v-if="type==2" @on-change="changetime"></DatePicker>
    <DatePicker type="daterange" :options="options" :value="timearr" placeholder="请选择报急时间" v-if="type == 3"
                placement="bottom"
                @on-change="changetime"></DatePicker>
  </div>
</template>
<script>
export default {
  name: "",
  props:{
    type:{
      default () {
        return 1
      }
    },
    timearr:{
      default () {
        return []
      }
    }
  },
  data () {
    return {
      options:{
        disabledDate (date) {
           return date && date.valueOf() > Date.now();
         }
      },
      options2: {
            shortcuts: [
                {
                    text: '最近3天',
                    value () {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
                        return [start, end];
                    }
                },
                {
                    text: '1周',
                    value () {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        return [start, end];
                    }
                },
                {
                    text: '1个月',
                    value () {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        return [start, end];
                    }
                },
                {
                    text: '3个月',
                    value () {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        return [start, end];
                    }
                },
                {
                    text: '6个月',
                    value () {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
                        return [start, end];
                    }
                }
            ],
            disabledDate (date) {
               return date && date.valueOf() > Date.now();
          }
        }
    }
  },
  methods: {
    changetime(time) {
      this.$emit("timeEmit",time)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
