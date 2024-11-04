<template>
  <header class="fixed-header">
  </header>
</template>

<style scoped>
.fixed-header {
  position: fixed;
  top: 0;
  left: 250px; /* 사이드바 너비만큼 오른쪽으로 이동 */
  width: calc(100% - 250px); /* 화면에서 사이드바 너비를 제외한 부분 */
  height: 75px; /* 헤더의 높이 설정 */
  background-color: #3F72AF;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000; /* 다른 요소보다 위에 표시 */
}
</style>
