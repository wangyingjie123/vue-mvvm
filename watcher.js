/*
*watcher是一个类，通过这个类创建的函数都会有update的方法
* 主要负责更新视图
*/
function Watcher(vm, exp, fn) {
    this.fn = fn;
    // 这里我们新增了一些内容，用来可以获取对的数据
    this.vm = vm; // vue实例
    // exp = 匹配的查找的对象”a.b”是字符串类型的值
    this.exp = exp;
    // 我们希望的是在实例化Watcher时将相应的Watcher实例添加一次进dep订阅器即可，
    // 而不希望在以后每次访问data.name属性时都加入一次dep订阅器。
    // 所以我们在实例化执行this.get()函数时用Dep.target = this来标识当前Watcher实例，
    // 当添加进dep订阅器后设置Dep.target=null。
    Dep.target = this;
    let val = vm;
    let arr = exp.split('.');
    /* 执行这一步的时候操作的是vm.a，    
    而这一步操作其实就是操作的vm._data.a的操作，    
    会触发this代理的数据和_data上面的数据    
    */
    arr.forEach(function (k) {
        val = val[k]
    });
    Dep.target = null;
}
Watcher.prototype.update = function () {
    let val = this.vm;
    let arr = this.exp.split('.');
    arr.forEach(function (k) {
        val = val[k]
    });
    this.fn(val) //这里面要传一个新值
};