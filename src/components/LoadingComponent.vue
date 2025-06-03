<template>
  <div class="logo-loader" :class="[size, { 'with-text': showText }]">
    <div class="loader-container">
      <div class="loader">
        <div class="cube">
          <div class="sides">
            <div class="top" :style="faceStyle"></div>
            <div class="right" :style="faceStyle"></div>
            <div class="bottom" :style="faceStyle"></div>
            <div class="left" :style="faceStyle"></div>
            <div class="front" :style="faceStyle"></div>
            <div class="back" :style="faceStyle"></div>
          </div>
        </div>
      </div>
    </div>

    <p v-if="showText" class="loader-text">{{ text }}</p>
  </div>
</template>
  
  <script setup>
import { defineProps, computed } from 'vue'
import defaultLogo from '@/assets/images/logo-loading.png'

const props = defineProps({
  size: {
    type: String,
    default: 'large', // small, medium, large
  },
  showText: {
    type: Boolean,
    default: true,
  },
  text: {
    type: String,
    default: 'Đang tải...',
  },
})

const faceStyle = computed(() => {
  return {
    backgroundImage: `url(${defaultLogo})`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }
})
</script>
  
  <style scoped>
.logo-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loader-container {
  position: relative;
  overflow: visible;
}

/* Kích thước theo size */
.small .loader-container {
  transform: scale(0.5);
}

.medium .loader-container {
  transform: scale(0.75);
}

.large .loader-container {
  transform: scale(1);
}

.loader {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto;
}

.cube {
  position: absolute;
  width: 80px;
  height: 80px;
  transform-style: preserve-3d;
  animation: cube 5s infinite ease;
}

.sides {
  position: absolute;
  width: 80px;
  height: 80px;
  transform-style: preserve-3d;
}

.top,
.right,
.bottom,
.left,
.front,
.back {
  position: absolute;
  width: 80px;
  height: 80px;
  opacity: 0.9;
  background-color: transparent !important;
  border: none !important;  
}

.top {
  transform: rotateX(90deg) translateZ(40px);
}

.right {
  transform: rotateY(90deg) translateZ(40px);
}

.bottom {
  transform: rotateX(-90deg) translateZ(40px);
}

.left {
  transform: rotateY(-90deg) translateZ(40px);
}

.front {
  transform: translateZ(40px);
}

.back {
  transform: rotateY(180deg) translateZ(40px);
}

/* Gradient effect for cube sides */
.top:before,
.right:before,
.bottom:before,
.left:before,
.front:before,
.back:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.5;
}

.loader-text {
  margin-top: 25px;
  font-size: 14px;
  color: #555;
  text-align: center;
}

.small .loader-text {
  font-size: 12px;
  margin-top: 15px;
}

.large .loader-text {
  font-size: 16px;
  margin-top: 30px;
}

/* Animation for cube */
@keyframes cube {
  0% {
    transform: rotate3d(1, 1, 1, 0deg);
  }
  25% {
    transform: rotate3d(1, 1, 0, 90deg);
  }
  50% {
    transform: rotate3d(1, 0, 1, 180deg);
  }
  75% {
    transform: rotate3d(0, 1, 1, 270deg);
  }
  100% {
    transform: rotate3d(1, 1, 1, 360deg);
  }
}
</style>