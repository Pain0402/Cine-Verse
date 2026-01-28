<template>
  <div class="star-bg-container">
    <div id="stars"></div>
    <div id="stars2"></div>
    <div id="stars3"></div>
  </div>
</template>

<style scoped>
.star-bg-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
  z-index: -1;
  overflow: hidden;
}

/* Function to generate random box-shadows for stars */
/* Since we are in scoped CSS, we can't use SASS loops easily without setup. 
   We will use a fixed set of box-shadows for simulation. 
   In a real SCSS setup we would generate this. 
   For now, I'll put a simplified version or a small script to generate inline styles if needed.
   Actually, let's use a smarter CSS approach or SVGs.
   Let's stick to a standard neat CSS animation using single div with multiple box-shadows.
*/

/* Helper to generate random stars */
/* Since I cannot run SCSS here, I will output a pre-calculated CSS for a nice effect */
</style>

<style>
/* Global unscoped styles for keyframes to work properly across component if needed, though scoped is fine */
@keyframes animStar {
  from { transform: translateY(0px); }
  to { transform: translateY(-2000px); }
}
</style>

<style scoped>
#stars {
  width: 1px;
  height: 1px;
  background: transparent;
  box-shadow: 1744px 122px #FFF , 134px 1321px #FFF , 92px 859px #FFF , 1803px 34px #FFF , 1530px 24px #FFF , 1123px 768px #FFF , 456px 987px #FFF , 678px 123px #FFF , 1234px 567px #FFF , 890px 1234px #FFF; /* Sample truncated for brevity, real one needs more */
  animation: animStar 50s linear infinite;
}
#stars:after {
  content: " ";
  position: absolute;
  top: 2000px;
  width: 1px;
  height: 1px;
  background: transparent;
  box-shadow: 1744px 122px #FFF , 134px 1321px #FFF , 92px 859px #FFF , 1803px 34px #FFF , 1530px 24px #FFF , 1123px 768px #FFF , 456px 987px #FFF , 678px 123px #FFF , 1234px 567px #FFF , 890px 1234px #FFF;
}
/* This manual box-shadow is tedious and ugly in code. 
   Let's switch to a Vue-based generation approach in <script setup>.
*/
</style>

<script setup>
// Generates random stars so we don't have massive CSS files
const generateBoxShadow = (n) => {
  let value = ''
  for (let i = 0; i < n; i++) {
    value += `${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #FFF`
    if (i < n - 1) value += ', '
  }
  return value
}

const stars1Shadow = generateBoxShadow(700)
const stars2Shadow = generateBoxShadow(200)
const stars3Shadow = generateBoxShadow(100)
</script>

<style scoped>
/* Re-defining properly using v-bind */
#stars {
  width: 1px;
  height: 1px;
  background: transparent;
  box-shadow: v-bind(stars1Shadow);
  animation: animStar 50s linear infinite;
}
#stars:after {
  content: " ";
  position: absolute;
  top: 2000px;
  width: 1px;
  height: 1px;
  background: transparent;
  box-shadow: v-bind(stars1Shadow);
}

#stars2 {
  width: 2px;
  height: 2px;
  background: transparent;
  box-shadow: v-bind(stars2Shadow);
  animation: animStar 100s linear infinite;
}
#stars2:after {
  content: " ";
  position: absolute;
  top: 2000px;
  width: 2px;
  height: 2px;
  background: transparent;
  box-shadow: v-bind(stars2Shadow);
}

#stars3 {
  width: 3px;
  height: 3px;
  background: transparent;
  box-shadow: v-bind(stars3Shadow);
  animation: animStar 150s linear infinite;
}
#stars3:after {
  content: " ";
  position: absolute;
  top: 2000px;
  width: 3px;
  height: 3px;
  background: transparent;
  box-shadow: v-bind(stars3Shadow);
}
</style>
