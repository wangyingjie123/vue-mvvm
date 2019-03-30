/*
* option{
*   el: '',
*   data: {}
*   }
* */
function MyVue(options = {}) {        
    this.$options = options;   // 将所有的属性挂载到$options身上
    var data = this._data = this.$options.data;   // 获取到data数据（Model）
    // 将myvue实例转化成proxy对象
    // let vm = initVm.call(this);
    // 递归将this._data转化成proxy对象
    observe(data);
    // 初始化试图模版
    Compile(this.$options.el, data);
    // new的时候返回转化完成的myvue-proxy实例
    return new Proxy(this, {
        // 拦截get
        get: (target, key, receiver) => {
            return this._data[key]
        },
        // 拦截set
        set: (target, key, value) => {
            return Reflect.set(this._data, key, value)
        }
    });
}