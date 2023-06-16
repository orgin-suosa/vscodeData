## 增加骨架屏占位 Dom #skeleton

```html
<div id="skeleton"></div>
<div id="app"></div>
```

## 初始化时间记录
```js
    (function (window) {
      var dsBridge = window.dsBridge;
      function logToLocaleString(method) {
        var date = new Date();
        console.log(date.toLocaleString() + ':' + date.getMilliseconds(), method);
      }

      window.onNativeLCEvent = logToLocaleString;
      window.onload = function () {
        dsBridge && dsBridge.call && dsBridge.call('onLCEvent', 'onload');
        logToLocaleString('onload');
      }

      document.addEventListener('DOMContentLoaded', function () {
        dsBridge && dsBridge.call && dsBridge.call('onLCEvent', 'DOMContentLoaded');
        logToLocaleString('DOMContentLoaded');
      });
      document.addEventListener('readystatechange', function () {
        if (document.readyState == 'interactive') {
          dsBridge && dsBridge.call && dsBridge.call('onLCEvent', 'interactive');
          logToLocaleString('interactive');
        }
        if (document.readyState == 'complete') {
          dsBridge && dsBridge.call && dsBridge.call('onLCEvent', 'complete');
          dsBridge && dsBridge.call && dsBridge.call('forceHideLoading');
          logToLocaleString('complete');
        }
      })
    }(window));
```
