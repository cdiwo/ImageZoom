/**
 * ImageZoom 图片缩放插件
 * Version: 2.2
 * Author: David Wei
 * Date: 2015-10-20 22:10
 * 用法：new DWImageZoom("div img", {isCilp:true});
 * 说明：
 * isClip==true，按比例缩放
 * img对象CSS:position:absolute; parent对象display:block,overflow:hidden,width,height
 */
var ImageZoom = function(selector, params) {
    var iz = this;

    var defaults = {
        isClip: false // 是否裁剪
    }

    for (var param in params) {
        defaults[param] = params[param];
    }

    iz.zoom = function(el) {
        // 图片的宽高
        var w = el.naturalWidth;
        var h = el.naturalHeight;
        // 包裹层的宽高
        var width = el.parentNode.offsetWidth; 
        var height = el.parentNode.offsetHeight;
        // 缩放后的尺寸
        var scaleWidth = width * h / w; 
        var scaleHeight = height * w / h;
        
        // console.log("w:"+w+" h:"+h+" width:"+width+" height:"+height);

        // 初始化元素位置
        el.style.position = "absolute";
        el.style.left =  "";
        el.style.top = "";
        el.style.width = "";
        el.style.height = "";
    
        // 包裹层大于图片且无需裁剪，直接居中显示
        if((width > w && height > h) && !defaults.isClip) {
            el.style.top = (height - h) / 2 + "px";
            el.style.left = (width - w) / 2 + "px";
        } else {
            var vertical = false;
            // 缩放后的宽度大于面板宽度，按照竖拍方式显示
            if(scaleHeight > width) {
                vertical = true;
            }    
            // 若要裁切图像时，切换显示方式
            if(defaults.isClip) {
                vertical = !vertical;
            }
            //console.log(vertical);
            if(vertical) {
                el.style.width = width + "px"; 
                el.style.top = (height - scaleWidth) / 2 + "px";
            } else {
                el.style.height = height + "px";
                el.style.left = (width - scaleHeight) / 2 + "px";
            }
        }
    }

    iz.load = function(el, callback) {
        var src = el.src;
        var height = el.naturalWidth;

        // 非IE无法预先获取图片宽高
        if(height == 0) {
            // 提供2种预加载方式
            if(typeof ImageOnReady != 'undefined'){
                ImageOnReady(src, function() {
                    callback()
                });
            } else {
                var image = new Image();
                image.src = src;
                
                image.onload = function() {
                    callback();
                }
            }
        } else {
            callback()
        }
    }

    iz.init = function() {
        var elements = document.querySelectorAll(selector);
        for (var index = 0, len = elements.length; index < len; index++) {
            var el = elements[index];
            iz.load(el, function(){
                iz.zoom(el);
            });
        }
    }

    this.init();
}
