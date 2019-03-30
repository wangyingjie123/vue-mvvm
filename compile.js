/*
* file： compile.js
* 把数据编译到我们的DOM节点上面，
* 也就是让视图层（view）要展示我们的数据了
* el: domId,
* vm: 其实是mvvm里面options参数，因为做了代理所以是this._data
* */

// 将数据和节点挂载在一起
function Compile(el, vm) {
    // el表示替换的范围
    vm.$el = document.querySelector(el);
    // 这里注意我们没有去直接操作DOM，而是把这个步骤移到内存中来操作，这里的操作是不会引发DOM节点的回流
    let fragment = document.createDocumentFragment(); // 文档碎片
    let child;
    // 赋值并判断--可直接传vm.$el.firstChild
    while (child = vm.$el.firstChild) {
        // 将app的内容移入内存中
        fragment.appendChild(child);
    }
    replace(fragment);

    function replace(fragment) {
        Array.from(fragment.childNodes).forEach(function (node) {//循环每一层
            let text = node.textContent;
            let reg = /\{\{(.*)\}\}/g;
            // 这里做了判断只有文本节点才去匹配，而且还要带{{***}}的字符串
            // nodeType：1、元素节点2、属性节点3、文本节点....
            // 处理v-model中的绑定
            inputmvvm(node, vm);
            // 处理文本节点中的{{}}绑定
            if (node.nodeType === 3 && reg.test(text)) {
                // 把匹配到的内容拆分成数组，比如匹配到a.b这样的形式
                let arr = RegExp.$1.split('.');
                let val = vm;
                // 这里对我们匹配到的定义数组，会依次去遍历它，来实现对实例的深度赋值
                arr.forEach(function (kv) { // this.a.b  this.c
                    val = val[kv]
                });
                // step-3 在这里运用了Watcher函数来新增要操作的事情
                new Watcher(vm, RegExp.$1, function (newVal) {
                    node.textContent = text.replace(/\{\{(.*)\}\}/, newVal)
                });

                // 用字符串的replace方法替换掉我们获取到的数据val
                node.textContent = text.replace(/\{\{(.*)\}\}/, val)
            }  
            // 这里做了判断，如果有子节点的话 使用递归
            if (node.childNodes) {
                replace(node)
            }
        })
    }

    // 最后把编译完的DOM加入到app元素中
    vm.$el.appendChild(fragment)
}
// 处理v-model
function inputmvvm(node, vm) {
    if (node.nodeType === 1) {
        let nodeAttr = node.attributes;
        Array.from(nodeAttr).forEach(function (attr) {
            let name = attr.name; // v-model="a.b"
            let exp = attr.value; // a.b
            if (name.indexOf('v-') >= 0) {
                let val = vm;
                let arr = exp.split('.');
                arr.forEach(function (n) {
                    val = val[n]
                });                   
                // 这个还好处理，取到对应的值设置给input.value就好
                node.value = val;
            }                
            // 这里也要定义一个Watcher，因为数据变更的时候也要变更带有v-model属性名的值
            new Watcher(vm, exp, function (newVal) {
                node.value = newVal
            });             
            // 这里是视图变化的时候，变更数据结构上面的值
            node.addEventListener('input', function (e) {
                let newVal = e.target.value;
                if (name.indexOf('v-') >= 0) {
                    let val = vm;
                    let arr = exp.split('.');
                    arr.forEach(function (k, index) {
                        // 这里判断到取到的不是对象数据类型，不做替换操作 （val = val[k]）
                        if (typeof val[k] === 'object') {
                            val = val[k];
                        } else {
                            // 判断是不是已经最后一个层级了index === arr.length-1，如果是的话直接把input中的值赋值进当前数据中即可
                            if (index === arr.length - 1) {
                                val[k] = newVal
                            }
                        }
                    })
                }
            })
        })
    }
}