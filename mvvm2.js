function MyVue(options = {}) {
    this.$options = options;   // 将所有的属性挂载到$options身上
    var data = this._data = this.$options.data;   // 获取到data数据（Model）
    observe(data);  // 劫持数据
    // 初始化试图模版
    Compile(this.$options.el, data);
    // this 就代理数据 this._data ---vm.a === vm.data.a
    for (const key in data) {            
        Object.defineProperty(this, key, {
            enumerable: true, // 可枚举
            get() {
                // this.a 这里取值的时候 实际上是去_data中的值                   
                return this._data[key]
            },
            set(newVal) {
                // 设置值的时候其实也是去改this._data.a的值
                this._data[key] = newVal
            }
        })
    }
}