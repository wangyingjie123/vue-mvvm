/*
*发布订阅
* 功能很简单：addSub添加订阅，notify在合适的时候发送消息
* */
function Dep() {
    this.subs = []
}
// 订阅
Dep.prototype.addSub = function (sub) {
    this.subs.push(sub)
};
// 通知
Dep.prototype.notify = function () {
    this.subs.forEach(item => item.update())
};