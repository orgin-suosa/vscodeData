<template>
  <div class="ndata">
    <img src="@/assets/images/no-data.png" alt="" />
    <span>暂无相关数据哦~</span>
  </div>
</template>

<script>
export default {
  name: 'Ndata',
};
</script>

<style scoped lang="scss">
.ndata {
  font-size: 18px;
  width: 100%;
  height: 100vh;
  display: flex;
  font-family: PingFangSC, PingFangSC-Medium;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  img {
    width: 195px;
    height: auto;
  }
  span {
    text-align: center;
    font-size: 12px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    color: #999999;
    margin-top: 8px;
  }
}
</style>
