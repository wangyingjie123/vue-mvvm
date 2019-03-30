/*
*{}
* */
// Observe类
class Observe {
    constructor(data) {
        this.dep = new Dep();
        for (let key in data) {
            data[key] = observe(data[key]) // 递归调用子对象
        }
        return this.proxy(data)
    }
    proxy(data) {
        let dep = this.dep;
        return new Proxy(data, {
            get: (target, key, receiver) => {
                Dep.target && dep.addSub(Dep.target);
                return Reflect.get(target, key, receiver)
            },
            set: (target, key, value) => {
                console.log('set');
                const result =  Reflect.set(target, key, observe(value)); // 对于新添加的对象也要进行添加observe
                dep.notify(); // 发布
                return result;
            }
        })
    }
}
function observe(data) {    // 这里做一下数据类型的判断，只有引用数据类型才去做数据劫持
    if (typeof data != 'object') return data;
    return new Observe(data)
}