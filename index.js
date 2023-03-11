var isdrag = true;  //是否移动
var topHeight = $(".others").css("height");  //头部div的高度
var topHeightInt = 0;
var elementHeight = $(".drag-div-elem").css("height");  //每一个移动元素DIV的高度
var elementHeightInt = 0;
var halfElementHeightInt = 0;
var startEleCssTopInt;//元素div的起始时的top值
var lastTouchTempY = null;//上一次滑动时元素触摸点坐标
var startTouchY; //起始时的触摸点坐标
var choseEleNum = null; //选择的是第几个元素
var eleMoveDistance = 0;   //选择元素相对于其他元素的距离
var isNeedMoveEle = true;   //其他元素是否需要移动
var theMaxNumberAttr = null; //元素最大的number值
var theMinNumberAttr = null; //元素最小的number值
var theMaxMoveScope = null;  //可以移动的最大范围  ，最小范围为topHeightInt；

//开始移动
function dragStart(e) {
    isdrag = true;
    e.preventDefault();
    startTouchY = e.originalEvent.targetTouches[0].pageY;
    var obj = $(e.target);
    var paywayEleObj = obj.parents(".drag-div-elem");
    choseEleNum = $(paywayEleObj).attr("number");
    var startTouchCssTop = $(paywayEleObj).css("top");
    if (undefined == startTouchCssTop || null == startTouchCssTop
        || "auto" == startTouchCssTop) {
        startEleCssTopInt = topHeightInt;
    } else {
        startEleCssTopInt = parseInt(startTouchCssTop.substring(0,
            startTouchCssTop.length - 2));
    }
    $(paywayEleObj).addClass("show-top");
    $(paywayEleObj).addClass("active-show");
}
// 移动中
function dragMove(e) {
    var direction = "up";
    e.preventDefault();
    //获取移动的距离
    var moveTouchY = e.originalEvent.targetTouches[0].pageY; //获取第一个触点
    console.log("moveTouchY===" + moveTouchY);
    console.log("lastTouchTempY===" + lastTouchTempY);
    if (isdrag) {
        var obj = $(e.target);
        var paywayEleObj = obj.parents(".drag-div-elem");
        //判断是不是在可移动的范围内
        if (moveTouchY < topHeightInt || moveTouchY > theMaxMoveScope) {
            return;
        }
        //此次滑动的距离
        var distance = moveTouchY - startTouchY;
        eleMoveDistance = eleMoveDistance + Math.abs((moveTouchY - (null == lastTouchTempY ? startTouchY : lastTouchTempY)));
        if (null == lastTouchTempY) {
            //向上滑动
            if (startTouchY > moveTouchY) {
                direction = "up";
            } else {
                direction = "down";
            }
        } else {
            //向上滑动
            if (lastTouchTempY > moveTouchY) {
                direction = "up";
            } else {
                direction = "down";
            }
        }
        var newCssTop = startEleCssTopInt + distance;
        if (newCssTop < 0) {
            return;
        }
        $(paywayEleObj).css({ "top": newCssTop + "px" });
        console.log("eleMoveDistance===" + eleMoveDistance);
        //向下移动
        if ("down" == direction && parseInt(theMaxNumberAttr) > parseInt(choseEleNum)) {
            if (isNeedMoveEle && eleMoveDistance < elementHeightInt && eleMoveDistance >= halfElementHeightInt) {
                isNeedMoveEle = false;
                var autoUpEleNum = parseInt(choseEleNum) + 1;
                var autoUpEleCssTop = $(".drag-div-elem[number='" + autoUpEleNum + "']").css("top");
                var autoUpEleCssTopInt = parseInt(autoUpEleCssTop.substring(0, autoUpEleCssTop.length - 2));
                var autoUpEleNewTop = autoUpEleCssTopInt - (elementHeightInt + 1);
                $(".drag-div-elem[number='" + autoUpEleNum + "']").css({ "top": autoUpEleNewTop + "px" });
                //换number
                $(".drag-div-elem[number='" + autoUpEleNum + "']").attr("number", choseEleNum);
                $(paywayEleObj).attr("number", autoUpEleNum);
                choseEleNum = autoUpEleNum;
            } else if (eleMoveDistance >= elementHeightInt) {
                eleMoveDistance = 0;
                isNeedMoveEle = true;
            }
        }
        //向上移动
        if ("up" == direction && parseInt(theMinNumberAttr) < parseInt(choseEleNum)) {
            if (isNeedMoveEle && eleMoveDistance < elementHeightInt && eleMoveDistance >= halfElementHeightInt) {
                isNeedMoveEle = false;
                var autoUpEleNum = parseInt(choseEleNum) - 1;
                var autoUpEleCssTop = $(".drag-div-elem[number='" + autoUpEleNum + "']").css("top");
                var autoUpEleCssTopInt = parseInt(autoUpEleCssTop.substring(0, autoUpEleCssTop.length - 2));
                var autoUpEleNewTop = autoUpEleCssTopInt + (elementHeightInt + 1);
                $(".drag-div-elem[number='" + autoUpEleNum + "']").css({ "top": autoUpEleNewTop + "px" });
                //换number
                $(".drag-div-elem[number='" + autoUpEleNum + "']").attr("number", choseEleNum);
                $(paywayEleObj).attr("number", autoUpEleNum);
                choseEleNum = autoUpEleNum;
            } else if (eleMoveDistance >= elementHeightInt) {
                eleMoveDistance = 0;
                isNeedMoveEle = true;
            }
        }
        lastTouchTempY = moveTouchY;
    }
}
// 移动结束
function dragEnd(e) {
    e.preventDefault();
    isdrag = false;
    lastTouchTempY = null;
    var obj = $(e.target);
    var paywayEleObj = obj.parents(".drag-div-elem");
    $(paywayEleObj).removeClass("show-top");
    //修正移动的元素的top
    var number = $(paywayEleObj).attr("number");
    var top = 0 + (elementHeightInt + 1) * (parseInt(number) - 1);
    $(paywayEleObj).css({ "top": (top + topHeightInt) + "px" });
}
$(function () {
    topHeightInt = parseInt(topHeight.substring(0, topHeight.length - 2));
    elementHeightInt = parseInt(elementHeight.substring(0, elementHeight.length - 2));
    halfElementHeightInt = parseInt(elementHeightInt + 2) / 2;
    var elementDivArr = $(".drag-div").find(".drag-div-elem");
    theMinNumberAttr = $(elementDivArr[0]).attr("number");
    for (var i = 0; i < elementDivArr.length; i++) {
        var eleObj = elementDivArr[i];
        var number = $(eleObj).attr("number");
        theMaxNumberAttr = number;
        var top = 0 + (elementHeightInt + 1) * (parseInt(number) - 1);
        $(eleObj).css({ "top": (top + topHeightInt) + "px" });
    }
    theMaxMoveScope = topHeightInt + number * (elementHeightInt + 1);
    $(".drag-inset-div").css("height", (number * (elementHeightInt + 1) + 1) + "px");
    $(".drag-div-elem").on("touchstart", dragStart);
    $(".drag-div-elem").on("touchmove", dragMove);
    $(".drag-div-elem").on("touchend", dragEnd);
});