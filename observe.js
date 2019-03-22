// 给需要观察的对象都添加 Object.defineProperty 的监听
function Observe(data) {
    // step-3
    let dep = new Dep();
    for (let key in data) {
        let val = data[key];                // 递归 =》来实现深层的数据监听
        observe(val);
        Object.defineProperty(data, key, {
            enumerable: true, // 是否可枚举
            get() {
                /* 获取值的时候 Dep.target                   
                对应着 watcher的实例，把他创建的实例加到订阅队列中                
                */
                Dep.target && dep.addSub(Dep.target);
                return val
            },
            set(newval) {
                if (val === newval) { //设置的值是否和以前是一样的，如果是就什么都不做
                    return
                }
                val = newval;
                // 递归调用下面observe方法，这里要把新设置的值也在添加一次数据劫持来实现深度响应,
                observe(newval);
                // step-3 设置值的时候让所有的watcher.update方法执行即可触发所有数据更新
                dep.notify();
            }
        })
    }
}
/*
* 没有直接用构造函数Observe去劫持我们的数据，
* 而是写多了一个observe的小方法用来new Observe，
* 并且在里面做了引用数据类型的判断。
* 这样做的目的是为了方便递归来实现数据结构的深层监听
* */
function observe(data) {    // 这里做一下数据类型的判断，只有引用数据类型才去做数据劫持
    if (typeof data != 'object') return;
    return new Observe(data)
}