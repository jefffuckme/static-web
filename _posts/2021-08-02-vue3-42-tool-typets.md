---
layout: post
title: VUE3-42-TypeScript 支持
date: 2021-08-02 21:01:55 +0800
categories: [VUE]
tags: [vue, vue3, vue-learn, vue3-learn, sh]
published: true
---

# NPM 包中的官方声明

随着应用的增长，静态类型系统可以帮助防止许多潜在的运行时错误，这就是为什么 Vue 3 是用 TypeScript 编写的。

这意味着在 Vue 中使用 TypeScript 不需要任何其他工具——它具有一流的公民支持。

# 推荐配置

```js
// tsconfig.json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    // 这样就可以对 `this` 上的数据属性进行更严格的推断`
    "strict": true,
    "jsx": "preserve",
    "moduleResolution": "node"
  }
}
```

请注意，必须包含 strict: true (或至少包含 noImplicitThis: true，它是 strict 标志的一部分) 才能在组件方法中利用 this 的类型检查，否则它总是被视为 any 类型。

参见 TypeScript 编译选项文档查看更多细节。

# 开发工具

## 项目创建

Vue CLI 可以生成使用 TypeScript 的新项目，开始：

```sh
# 1. Install Vue CLI, 如果尚未安装
npm install --global @vue/cli@next

# 2. 创建一个新项目, 选择 "Manually select features" 选项
vue create my-project-name

# 3. 如果已经有一个不存在TypeScript的 Vue CLI项目，请添加适当的 Vue CLI插件：
vue add typescript
```

请确保组件的 script 部分已将语言设置为 TypeScript：

```js
<script lang="ts">
  ...
</script>
```

## 编辑器支持

对于使用 TypeScript 开发 Vue 应用程序，我们强烈建议使用 Visual Studio Code，它为 TypeScript 提供了很好的开箱即用支持。

如果你使用的是单文件组件 (SFCs)，那么可以使用很棒的 Vetur extension，它在 SFCs 中提供了 TypeScript 推理和许多其他优秀的特性。

WebStorm 还为 TypeScript 和 Vue 提供现成的支持。

# 定义 Vue 组件

要让 TypeScript 正确推断 Vue 组件选项中的类型，需要使用 defineComponent 全局方法定义组件：

```js
import { defineComponent } from 'vue'

const Component = defineComponent({
  // 已启用类型推断
})
```

# 与 Options API 一起使用

TypeScript 应该能够在不显式定义类型的情况下推断大多数类型。

例如，如果有一个具有数字 count property 的组件，如果试图对其调用特定于字符串的方法，则会出现错误：

```js
const Component = defineComponent({
  data() {
    return {
      count: 0
    }
  },
  mounted() {
    const result = this.count.split('') // => Property 'split' does not exist on type 'number'
  }
})
```

如果你有一个复杂的类型或接口，你可以使用 type assertion 对其进行强制转换：

```js
interface Book {
  title: string
  author: string
  year: number
}

const Component = defineComponent({
  data() {
    return {
      book: {
        title: 'Vue 3 Guide',
        author: 'Vue Team',
        year: 2020
      } as Book
    }
  }
})
```

## 注释返回类型

由于 Vue 声明文件的循环特性，TypeScript 可能难以推断 computed 的类型。因此，你可能需要注释返回类型的计算属性。

```ts
import { defineComponent } from 'vue'

const Component = defineComponent({
  data() {
    return {
      message: 'Hello!'
    }
  },
  computed: {
    // 需要注释
    greeting(): string {
      return this.message + '!'
    }

    // 在使用setter进行计算时，需要对getter进行注释
    greetingUppercased: {
      get(): string {
        return this.greeting.toUpperCase();
      },
      set(newValue: string) {
        this.message = newValue.toUpperCase();
      },
    },
  }
})
```

## 注释 Props

Vue 对定义了 type 的 prop 执行运行时验证。要将这些类型提供给 TypeScript，我们需要使用 PropType 强制转换构造函数：


```js
import { defineComponent, PropType } from 'vue'

interface ComplexMessage {
  title: string
  okMessage: string
  cancelMessage: string
}
const Component = defineComponent({
  props: {
    name: String,
    success: { type: String },
    callback: {
      type: Function as PropType<() => void>
    },
    message: {
      type: Object as PropType<ComplexMessage>,
      required: true,
      validator(message: ComplexMessage) {
        return !!message.title
      }
    }
  }
})
```

如果你发现验证器没有得到类型推断或者成员完成不起作用，那么用期望的类型注释参数可能有助于解决这些问题。

# 与组合式 API 一起使用

在 setup() 函数中，不需要将类型传递给 props 参数，因为它将从 props 组件选项推断类型。


```ts
import { defineComponent } from 'vue'

const Component = defineComponent({
  props: {
    message: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const result = props.message.split('') // 正确, 'message' 被声明为字符串
    const filtered = props.message.filter(p => p.value) // 将引发错误: Property 'filter' does not exist on type 'string'
  }
})
```

## 类型声明 ref

Refs 根据初始值推断类型：

```js
import { defineComponent, ref } from 'vue'

const Component = defineComponent({
  setup() {
    const year = ref(2020)

    const result = year.value.split('') // => Property 'split' does not exist on type 'number'
  }
})
```

有时我们可能需要为 ref 的内部值指定复杂类型。我们可以在调用 ref 重写默认推理时简单地传递一个泛型参数：

```js
const year = ref<string | number>('2020') // year's type: Ref<string | number>

year.value = 2020 // ok!
```

## 类型声明 reactive

当声明类型 reactive property，我们可以使用接口：

```js
import { defineComponent, reactive } from 'vue'

interface Book {
  title: string
  year?: number
}

export default defineComponent({
  name: 'HelloWorld',
  setup() {
    const book = reactive<Book>({ title: 'Vue 3 Guide' })
    // or
    const book: Book = reactive({ title: 'Vue 3 Guide' })
    // or
    const book = reactive({ title: 'Vue 3 Guide' }) as Book
  }
})
```

## 类型声明 computed

计算值将根据返回值自动推断类型

```js
import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  name: 'CounterButton',
  setup() {
    let count = ref(0)

    // 只读
    const doubleCount = computed(() => count.value * 2)

    const result = doubleCount.value.split('') // => Property 'split' does not exist on type 'number'
  }
})
```

# 参考资料

https://vue3js.cn/docs/zh/guide/typescript-support.html

* any list
{:toc}