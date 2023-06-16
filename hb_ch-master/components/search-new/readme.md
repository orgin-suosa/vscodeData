## 使用说明

* 引入使用  带历史搜索 使用示例详见首页（searchPage/search  组件）  演示：进入首页点击搜索：/home/searchPage/search
*     <search
      :is-focus="false"
      :theme="themeClass"
      :show-want="true"
      :speechEngine="''"
      :hot-list="hot_list"
      :search-his-list="search_his_list"
      :suggest-text="suggest_text"
      @getSearchText="getSearchText"
      @clearSearch="clearSearch"
    ></search>
* 引入使用  无需带历史搜索  noSearchHistory
*     <noSearchHistory
      :is-focus="false"
      :theme="themeClass"
      :show-want="true"
      :speechEngine="''"
      :hot-list="hot_list"
      :search-his-list="search_his_list"
      :suggest-text="suggest_text"
	  :istartButton="true"
	  :isHistory="true"
	  startButtonText="开始扫雷"   // 可选右侧搜索按钮文案
	  placeholderText="请输入股票名称/代码"
      @getSearchText="getSearchText"
      @clearSearch="clearSearch"
    >