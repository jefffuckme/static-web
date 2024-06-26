---
layout: post
title: VUE3-35-Setup
date: 2021-08-02 21:01:55 +0800
categories: [VUE]
tags: [vue, vue3, vue-learn, vue3-learn, sh]
published: true
---

# 参数

使用 setup 函数时，它将接受两个参数：

props

context

让我们更深入地研究如何使用每个参数。

## Props

setup 函数中的第一个参数是 props。正如在一个标准组件中所期望的那样，setup 函数中的 props 是响应式的，当传入新的 prop 时，它将被更新

```js
// MyBook.vue

export default {
  props: {
    title: String
  },
  setup(props) {
    console.log(props.title)
  }
}
```

- WARNING

但是，因为 props 是响应式的，你不能使用 ES6 解构，因为它会消除 prop 的响应性。

如果需要解构 prop，可以通过使用 setup 函数中的 toRefs 来安全地完成此操作。

```js
// MyBook.vue

import { toRefs } from 'vue'

setup(props) {
	const { title } = toRefs(props)

	console.log(title.value)
}
```

## 上下文

传递给 setup 函数的第二个参数是 context。context 是一个普通的 JavaScript 对象，它暴露三个组件的 property：

```js
// MyBook.vue

export default {
  setup(props, context) {
    // Attribute (非响应式对象)
    console.log(context.attrs)

    // 插槽 (非响应式对象)
    console.log(context.slots)

    // 触发事件 (方法)
    console.log(context.emit)
  }
}
```

context 是一个普通的 JavaScript 对象，也就是说，它不是响应式的，这意味着你可以安全地对 context 使用 ES6 解构

```js
// MyBook.vue
export default {
  setup(props, { attrs, slots, emit }) {
    ...
  }
}
```

attrs 和 slots 是有状态的对象，它们总是会随组件本身的更新而更新。

这意味着你应该避免对它们进行解构，并始终以 attrs.x 或 slots.x 的方式引用 property。

请注意，与 props 不同，attrs 和 slots 是非响应式的。

如果你打算根据 attrs 或 slots 更改应用副作用，那么应该在 onUpdated 生命周期钩子中执行此操作。

# 访问组件的 property

执行 setup 时，组件实例尚未被创建。因此，你只能访问以下 property：

- props

- attrs

- slots

- emit


换句话说，你将无法访问以下组件选项：

- data

- computed

- methods

# 结合模板使用

如果 setup 返回一个对象，则可以在组件的模板中像传递给 setup 的 props property 一样访问该对象的 property：

```js
<!-- MyBook.vue -->
<template>
  <div>{{ readersNumber }} {{ book.title }}</div>
</template>

<script>
  import { ref, reactive } from 'vue'

  export default {
    setup() {
      const readersNumber = ref(0)
      const book = reactive({ title: 'Vue 3 Guide' })

      // expose to template
      return {
        readersNumber,
        book
      }
    }
  }
</script>
```

注意，从 setup 返回的 refs 在模板中访问时是被自动解开的，因此不应在模板中使用 .value。

# 使用渲染函数

setup 还可以返回一个渲染函数，该函数可以直接使用在同一作用域中声明的响应式状态：

```js
// MyBook.vue

import { h, ref, reactive } from 'vue'

export default {
  setup() {
    const readersNumber = ref(0)
    const book = reactive({ title: 'Vue 3 Guide' })
    // Please note that we need to explicitly expose ref value here
    return () => h('div', [readersNumber.value, book.title])
  }
}
```

# 使用 this

在 setup() 内部，this 不会是该活跃实例的引用，因为 setup() 是在解析其它组件选项之前被调用的，所以 setup() 内部的 this 的行为与其它选项中的 this 完全不同。

这在和其它选项式 API 一起使用 setup() 时可能会导致混淆。

# 生命周期钩子

你可以通过在生命周期钩子前面加上 “on” 来访问组件的生命周期钩子。

下表包含如何在 setup () 内部调用生命周期钩子：

| 选项式 API	|  Hook inside setup | 
|:----|:----|
| beforeCreate	 | Not needed* |
| created	| Not needed* |
| beforeMount	| onBeforeMount |
| mounted	| onMounted |
| beforeUpdate	| onBeforeUpdate |
| updated	| onUpdated |
| beforeUnmount	| onBeforeUnmount |
| unmounted	| onUnmounted |
| errorCaptured	| onErrorCaptured |
| renderTracked	| onRenderTracked |
| renderTriggered	| onRenderTriggered |

- TIP

因为 setup 是围绕 beforeCreate 和 created 生命周期钩子运行的，所以不需要显式地定义它们。换句话说，在这些钩子中编写的任何代码都应该直接在 setup 函数中编写。

这些函数接受一个回调函数，当钩子被组件调用时将会被执行:

```js
// MyBook.vue

export default {
  setup() {
    // mounted
    onMounted(() => {
      console.log('Component is mounted!')
    })
  }
}
```

# 参考资料

https://vue3js.cn/docs/zh/guide/composition-api-setup.html

* any list
{:toc}