<template>
  <div id="">
   <DatePicker type="daterange"
     :options="options2"
     @on-change="changetime"
     placement="bottom-start"
     placeholder="请选择时间"
   >
 </DatePicker>
  </div>
</template>
<script>
export default {
  name: "",
  data: () => ({
    options2: {
            shortcuts: [
                {
                    text: '最近一周',
                    value () {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        return [start, end];
                    }
                },
                {
                    text: '最近一月',
                    value () {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        return [start, end];
                    }
                },
            ]
        }
  }),
  mounted() {
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
