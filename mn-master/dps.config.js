// dps.config.js
const fs = require('fs');
const path = require('path');

// 需要展示完成页面的地址，可以写本地调试地址
const url = 'http://10.3.132.70:8080/h5-agent-business/business';

// 生成骨架屏的存放页面，一般为项目的入口页面
const componentsPath = './src/skeleton/components';
const componentName = process.argv[3] || 'SkeletonHome';

// 创建组件文件夹
if (!fs.existsSync(componentsPath)) {
  fs.mkdirSync(componentsPath);
}

const filepath = path.join(__dirname, componentsPath, `${componentName}.vue`);

const dpsConfig = {
  url,
  output: { filepath: '' },
  background: '#eee',
  animation: 'mn-skeleton-blink 1.2s ease-in-out infinite;',
  includeElement: function(node, draw) {
    // 定制某个节点
    // if (node.tagName.toLowerCase() === 'img') {
    //   // 对该图片生成宽100%，高8%，颜色为红色的色块
    //   draw({
    //     width: 100,
    //     height: 8,
    //     left: 0,
    //     top: 0,
    //     zIndex: 99999999,
    //     background: 'red'
    //   });
    //   return false;
    // }
  },
  writePageStructure: function(html) {
    // 自己处理生成的骨架屏
    html = html.replace(/<style(([\s\S])*?)<\/style>/, '', '');
    console.log('html: ', html);
    const template = `<template>
  <div class="skeleton-component">
    ${html}
  </div>
</template>

<script>
  export default {
    name: 'componentName',
  };
</script>

<style>
  @import "./index.css";
</style>`;
    fs.writeFileSync(filepath, template.replace(/componentName/g, componentName));
  },
  init: function() {
    // 生成骨架屏之前的操作，比如删除干扰节点
  },
};

module.exports = dpsConfig;
