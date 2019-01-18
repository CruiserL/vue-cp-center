
 //orientationchange方向改变事件
(function (doc,win) {
    var docEl = doc.documentElement,//根元素html
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
         //判断窗口有没有orientationchange这个方法，有就赋值给一个变量，没有就返回resize方法。
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;

            docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';

        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);//addEventListener事件方法接受三个参数：第一个是事件名称比如点击事件onclick，第二个是要执行的函数，第三个是布尔
    doc.addEventListener('DOMContentLoaded', recalc, false);//绑定浏览器缩放与加载时间
})(document, window);

