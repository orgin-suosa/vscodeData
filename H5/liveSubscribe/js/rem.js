(function flexible (window, document) {
    var docEl = document.documentElement
    var dpr = window.devicePixelRatio || 1
  
    // adjust body font size
    function setBodyFontSize () {
      if (document.body) {
        document.body.style.fontSize = (12 * dpr) + 'px'
      }
      else {
        document.addEventListener('DOMContentLoaded', setBodyFontSize)
      }
    }
    setBodyFontSize();
  
    // set 1rem = viewWidth / 10
    function setRemUnit () {
      var rem = docEl.clientWidth / 24
      //这里可以根据自己的设计图来平分等份  手机设计稿一般为640px或者750px  640px的可以划分为10等份这样1rem=64px了  750px可以划分为7.5份 则1rem=100px 
      //大屏适配1920*1080 1920px  1920/24 = 80px 也就是1rem = 80px  hbuilder编辑器默认1rem=16px 可以到工具--设置--编辑设置里修改为80 这样就可以自动转换了啦。。
      // vscode 可以下载个cssrem插件 然后找到该插件设置下就可以实现自动转换了
      docEl.style.fontSize = rem + 'px'
    }
  
    setRemUnit()
  
    // reset rem unit on page resize
    window.addEventListener('resize', setRemUnit)
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) {
        setRemUnit()
      }
    })
  
    // detect 0.5px supports
    if (dpr >= 2) {
      var fakeBody = document.createElement('body')
      var testElement = document.createElement('div')
      testElement.style.border = '.5px solid transparent'
      fakeBody.appendChild(testElement)
      docEl.appendChild(fakeBody)
      if (testElement.offsetHeight === 1) {
        docEl.classList.add('hairlines')
      }
      docEl.removeChild(fakeBody)
    }
  }(window, document))
  