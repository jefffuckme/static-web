---
layout: post
title: VUE3-16-自定义事件
date: 2021-08-02 21:01:55 +0800
categories: [VUE]
tags: [vue, hello-world, vue-learn, sh]
published: true
---

# 事件名

不同于组件和 prop，事件名不存在任何自动化的大小写转换。

而是触发的事件名需要完全匹配监听这个事件所用的名称。

举个例子，如果触发一个 camelCase 名字的事件：

```js
this.$emit('myEvent')
```

则监听这个名字的 kebab-case 版本是不会有任何效果的：

```xml
<!-- 没有效果 -->
<my-component @my-event="doSomething"></my-component>
```

不同于组件和 prop，事件名不会被用作一个 JavaScript 变量名或 property 名，所以就**没有理由使用 camelCase 或 PascalCase 了**。

并且 v-on 事件监听器在 DOM 模板中会被自动转换为全小写 (因为 HTML 是大小写不敏感的)，所以 @myEvent 将会变成 @myevent——导致 myEvent 不可能被监听到。

因此，我们**推荐你始终使用 kebab-case 的事件名**。

# 定义自定义事件

可以通过 emits 选项在组件上定义已发出的事件。

```js
app.component('custom-form', {
  emits: ['in-focus', 'submit']
})
```

当在 emits 选项中定义了原生事件 (如 click) 时，将使用组件中的事件替代原生事件侦听器。

- TIP

建议定义所有发出的事件，以便更好地记录组件应该如何工作。

## 验证抛出的事件

与 prop 类型验证类似，如果使用对象语法而不是数组语法定义发出的事件，则可以验证它。

要添加验证，将为事件分配一个函数，该函数接收传递给 $emit 调用的参数，并返回一个布尔值以指示事件是否有效。

```js
app.component('custom-form', {
  emits: {
    // 没有验证
    click: null,

    // 验证submit 事件
    submit: ({ email, password }) => {
      if (email && password) {
        return true
      } else {
        console.warn('Invalid submit event payload!')
        return false
      }
    }
  },
  methods: {
    submitForm() {
      this.$emit('submit', { email, password })
    }
  }
})
```

# v-model 参数

默认情况下，组件上的 v-model 使用 modelValue 作为 prop 和 update:modelValue 作为事件。

我们可以通过向 v-model 传递参数来修改这些名称：

```xml
<my-component v-model:foo="bar"></my-component>
```

在本例中，子组件将需要一个 foo prop 并发出 update:foo 要同步的事件：

```js
const app = Vue.createApp({})

app.component('my-component', {
  props: {
    foo: String
  },
  template: `
    <input 
      type="text"
      :value="foo"
      @input="$emit('update:foo', $event.target.value)">
  `
})
```

```xml
<my-component v-model:foo="bar"></my-component>
```

ps: 这种方式更加自然一些。

# 多个 v-model 绑定

通过利用以特定 prop 和事件为目标的能力，正如我们之前在 v-model 参数中所学的那样，我们现在可以在单个组件实例上创建多个 v-model 绑定。

每个 v-model 将同步到不同的 prop，而不需要在组件中添加额外的选项：

```xml
<user-name
  v-model:first-name="firstName"
  v-model:last-name="lastName"
></user-name>
```

```js
const app = Vue.createApp({})

app.component('user-name', {
  props: {
    firstName: String,
    lastName: String
  },
  template: `
    <input 
      type="text"
      :value="firstName"
      @input="$emit('update:firstName', $event.target.value)">

    <input
      type="text"
      :value="lastName"
      @input="$emit('update:lastName', $event.target.value)">
  `
})
```

# 处理 v-model 修饰符

在 2.x 中，我们对组件 v-model 上的 .trim 等修饰符提供了硬编码支持。

但是，如果组件可以支持自定义修饰符，则会更有用。

在 3.x 中，添加到组件 v-model 的修饰符将通过 modelModifiers prop 提供给组件：

当我们学习表单输入绑定时，我们看到 v-model 有内置修饰符——.trim、.number 和 .lazy。但是，在某些情况下，你可能还需要添加自己的自定义修饰符。

让我们创建一个示例自定义修饰符 capitalize，它将 v-model 绑定提供的字符串的第一个字母大写。

添加到组件 v-model 的修饰符将通过 modelModifiers prop 提供给组件。在下面的示例中，我们创建了一个组件，其中包含默认为空对象的 modelModifiers prop。

请注意，当组件的 created 生命周期钩子触发时，modelModifiers prop 包含 capitalize，其值为 true——因为它被设置在 v-model 绑定 v-model.capitalize="bar"。

```xml
<my-component v-model.capitalize="bar"></my-component>
```

```js
app.component('my-component', {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({})
    }
  },
  template: `
    <input type="text" 
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)">
  `,
  created() {
    console.log(this.modelModifiers) // { capitalize: true }
  }
})
```

现在我们已经设置了 prop，我们可以检查 modelModifiers 对象键并编写一个处理器来更改发出的值。

在下面的代码中，每当 `<input/>` 元素触发 input 事件时，我们都将字符串大写。

```xml
<div id="app">
  <my-component v-model.capitalize="myText"></my-component>
  ${ myText }
</div>
```

```js
const app = Vue.createApp({
  data() {
    return {
      myText: ''
    }
  }
})

app.component('my-component', {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({})
    }
  },
  methods: {
    emitValue(e) {
      let value = e.target.value
      if (this.modelModifiers.capitalize) {
        value = value.charAt(0).toUpperCase() + value.slice(1)
      }
      this.$emit('update:modelValue', value)
    }
  },
  template: `<input
    type="text"
    :value="modelValue"
    @input="emitValue">`
})

app.mount('#app')
```

对于带参数的 v-model 绑定，生成的 prop 名称将为 arg + "Modifiers"：

```xml
<my-component v-model:foo.capitalize="bar"></my-component>
```

```js
app.component('my-component', {
  props: ['foo', 'fooModifiers'],
  template: `
    <input type="text" 
      :value="foo"
      @input="$emit('update:foo', $event.target.value)">
  `,
  created() {
    console.log(this.fooModifiers) // { capitalize: true }
  }
})
```

# 参考资料

https://vue3js.cn/docs/zh/guide/component-custom-events.html

* any list
{:toc}