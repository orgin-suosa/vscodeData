<template>
    <view class="ep-picker-box">
        <!-- 蒙版区域 开始 -->
        <view class="ep-mask-box" v-show="show" @click="clickMask"></view>
        <!-- 蒙版区域 开始 -->
        
        <!-- 输入框区域 开始 -->
        <view class="ep-input-box" :class="{'disabled':disabled}">
            <!-- 如果未开启搜索 则文本一直显示 如果开启了搜索，则下拉收起时才展示 -->
            <view v-show="!filterable || (filterable && !show)" class="label-item"  @click="openOptions">{{showLabel}}</view>
            <view v-if="filterable && show" class="input-item">
                <uni-easyinput type="text" v-model="input" focus :placeholder="showLabel" :clearable="false" :inputBorder="false"></uni-easyinput>
            </view>
            <text v-if="!show" class="iconfont icon-xiala"></text>
            <text v-else class="iconfont icon-xialashang"></text>
        </view>
        <!-- 输入框区域 结束 -->
        
        <!-- 弹出的下拉区域 开始 -->
        <view v-show="show" class="ep-picker-content-wrap">
            <scroll-view class="ep-picker-content" :scroll-y="true">
                <view v-for="(item, index) in filterOptions" :key="item[value_key]" 
                :class="{'disabled':item.disabled,'active': showLabel==item[label_key] }"
                class="option-item"
                @click="itemClick(item,index)"
                >{{item[label_key]}}</view>
                <view v-if='filterOptions.length==0' class="empty-text">暂无数据</view>
            </scroll-view>
            <text class="triangle"></text>
        </view>
        <!-- 弹出的下拉区域 结束 -->
    </view>
</template>

<script>
    export default{
        data(){
            return {
                show: false,//是否展示下拉选项
                input:"",//开启搜索时输入框的值
            }
        },
        props:{
            value:{
                type:[String,Number],
                default:"1"
            },
            options:{
                type: Array,
                default: function(){
                    return []
                }
            },
            value_key:{
                type:String,
                default:"value"
            },
            label_key:{
                type:String,
                default:"label"
            },
            disabled:{
                type:Boolean,
                default:false
            },
            filterable:{
                type:Boolean,
                default:false
            },	
			"keep-input":{
				type:Boolean,
				default:false
			}
        },
        model:{
            prop:'value',
            event:"valChange"
        },
        mounted(){
            
        },
        methods:{ 
            //点击选中选项
            itemClick(item,index){
                if(item.disabled) return
                
                //关闭
                this.show = false
                //修改v-model的值
                this.$emit('valChange',item[this.value_key])
                //将事件通知父组件
                this.$emit('change',item[this.value_key])
                
                //重置输入框
				if(!this.keepInput){
					this.input = ''
				}
                
            },
            //展开选项
            openOptions(){
                if(!this.disabled){
                    this.show  = true
                }
            },
            //点击蒙版
            clickMask(){
                this.show = false
                //重置输入框
                if(!this.keepInput){
                	this.input = ''
                }
            }
        },
        computed:{
            //展示已选中的文本
            showLabel(){
                var index = this.options.findIndex(item=>{
                    return item[this.value_key] == this.value
                })
                if(index != -1){
                    return this.options[index][this.label_key]
                }else{
                    return this.options[0].label
                }
            },
            //过滤后的列表
            filterOptions(){
                return this.options.filter(item=>{
                    return item[this.label_key].includes(this.input)
                })
            }
        }
    }
</script>

<style scoped lang="scss">
	/* 引入字体图标 */
	@import './iconfont.css';
	
    .ep-picker-box{
        box-sizing: border-box;
        position: relative;
        min-width: 185px;
        color: #333;
        background-color: #fff;
		font-size: 14px;
    }
    .ep-mask-box{
        position: fixed;
        z-index: 999;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background:none;
    }
    .ep-input-box{
        border: 1px solid rgb(229, 229, 229);
        border-radius: 4px;
        /* padding-left:10px; */
        position: relative;
        cursor: pointer;
    }
    
    .ep-input-box .label-item{
        display: flex;align-items: center;min-height: 36px;padding-left:10px;
    }
    .ep-input-box.disabled .label-item{
        color:#999;
    }
    .ep-input-box .input-item{
        display: flex;align-items: center;min-height: 36px;
    }
    
    .ep-input-box.disabled{
        cursor:not-allowed;
        background-color: #f5f7fa;
    }
    .ep-input-box .iconfont{
        position: absolute;
        top: 50%;
        right:5px;
        font-size: 20px;
        transform: translateY(-50%);
        color:#B8B8B8;
    }
    .ep-picker-content-wrap{
        width: 100%;
        position: absolute;
        top: 45px;
        left: 0;
        
        z-index: 9999;
        padding-top:6px;
    }
    .ep-picker-content-wrap .ep-picker-content{
        background-color: #fff;
        padding:3px 0;
        font-size: 14px;
        
        box-shadow: 0 0 20px 5px rgba(0,0,0,0.3);
        border-radius: 5px;
        max-height:181px;
    }
    .ep-picker-content-wrap .ep-picker-content .option-item{
        padding: 8px 18px;
        cursor: pointer;
    }
    .ep-picker-content-wrap .ep-picker-content .option-item.active{
        color:#007AFF; 
    }
    .ep-picker-content-wrap .ep-picker-content .option-item.disabled{
        color:#c0c4cc; 
    }
    .ep-picker-content-wrap .ep-picker-content .option-item:hover{
        background-color: #f5f7fa;
    }
    .ep-picker-content-wrap .ep-picker-content .option-item.disabled:hover{
        cursor:not-allowed;
    }
    .ep-picker-content-wrap .triangle{
        width: 0;
        height: 0;
        border-top: 6px solid rgba(0,0,0,0);
        border-right: 6px solid rgba(0,0,0,0);
        border-bottom: 6px solid #fff;
        border-left: 6px solid rgba(0,0,0,0);
        position: absolute;
        top:-6px;
        left:50%;
        transform: translateX(-50%);
        box-sizing: content-box;
    }
    .empty-text{
        color:#999;
        text-align: center;
        padding: 3px 0;
        font-size: 14px;
    }
</style>