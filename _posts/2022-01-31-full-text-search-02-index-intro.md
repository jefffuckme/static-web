---
layout: post
title: 从零开始设计一个全文检索查询引擎-02-es 中有表的概念吗？
date: 2022-01-29 21:01:55 +0800 
categories: [Lucene]
tags: [Lucene, search, code, search, sh]
published: true
---

# 数据库

在数据库中，我们有 database 和 table 的概念。

我们在 ES 中有这些概念吗？

# ES 中表的概念

ES（Elasticsearch）是一个基于Lucene构建的开源搜索引擎，主要用于实时搜索、分析和存储大规模数据。

在Elasticsearch中，没有直接的表（table）的概念，而是通过索引（index）、类型（type）和文档（document）来组织和存储数据。

1. **索引（Index）：** 索引是Elasticsearch中最高层次的数据容器，类似于数据库中的数据库（database）。每个索引都包含一组相关的文档，并且具有自己的设置和映射。

2. **类型（Type）：** 在较早的Elasticsearch版本中，类型用于在同一索引中组织不同类型的文档。但是自从Elasticsearch 7.0版本开始，类型已经被弃用，推荐将所有相关的文档存储在单个索引中。

3. **文档（Document）：** 文档是Elasticsearch中最基本的数据单元，类似于数据库中的行。每个文档是一个JSON对象，包含一组字段和对应的值。文档存储在索引中，并通过唯一的ID进行标识。

虽然Elasticsearch中没有直接的表的概念，但是通过索引、类型和文档的组织方式，可以实现类似于关系型数据库中表的功能。

# 对应到我们的 fulltext-search 设计？

为了简单，我们这里作为底层的全文检索核心，暂时不关心 index 这个概念，直接移除掉，降低设计的复杂度。






# chat



## ES 中是否存在表的概念

ES（Elasticsearch）是一个基于Lucene构建的开源搜索引擎，主要用于实时搜索、分析和存储大规模数据。

在Elasticsearch中，没有直接的表（table）的概念，而是通过索引（index）、类型（type）和文档（document）来组织和存储数据。

1. **索引（Index）：** 索引是Elasticsearch中最高层次的数据容器，类似于数据库中的数据库（database）。每个索引都包含一组相关的文档，并且具有自己的设置和映射。

2. **类型（Type）：** 在较早的Elasticsearch版本中，类型用于在同一索引中组织不同类型的文档。但是自从Elasticsearch 7.0版本开始，类型已经被弃用，推荐将所有相关的文档存储在单个索引中。

3. **文档（Document）：** 文档是Elasticsearch中最基本的数据单元，类似于数据库中的行。每个文档是一个JSON对象，包含一组字段和对应的值。文档存储在索引中，并通过唯一的ID进行标识。

虽然Elasticsearch中没有直接的表的概念，但是通过索引、类型和文档的组织方式，可以实现类似于关系型数据库中表的功能。

## ES 如何创建 index?

在Elasticsearch中，你可以使用RESTful API或者Elasticsearch提供的客户端库来创建索引。

以下是使用RESTful API创建索引的基本步骤：

1. **使用PUT请求创建索引：** 发送PUT请求到Elasticsearch的索引管理端点，并指定要创建的索引名称。例如，如果你想创建一个名为"my_index"的索引，可以使用以下命令：

```bash
PUT /my_index
```

这将在Elasticsearch中创建一个名为"my_index"的索引。

2. **指定索引设置（可选）：** 你可以通过在PUT请求的正文中指定索引的设置来定义索引的配置，例如分片和副本数。例如：

```bash
PUT /my_index
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 1
  }
}
```

这将创建一个名为"my_index"的索引，并将分片数设置为1，副本数设置为1。

通过这些步骤，你就可以创建一个简单的索引。

在实际应用中，你可能还会定义索引的映射（mapping），以及其他更复杂的配置，以满足你的需求。

## 如何指定这个 index 有哪些字段属性？

在Elasticsearch中，你可以通过映射（mapping）来定义索引中的字段属性。

映射定义了索引中每个字段的数据类型以及其他属性，如分词器、索引选项等。

以下是如何指定索引中的字段属性的基本步骤：

1. **在创建索引时指定映射：** 在创建索引时，可以在PUT请求的正文中指定映射。例如：

```bash
PUT /my_index
{
  "mappings": {
    "properties": {
      "field1": {
        "type": "text"
      },
      "field2": {
        "type": "keyword"
      },
      "field3": {
        "type": "integer"
      }
    }
  }
}
```

在这个例子中，我们为索引"my_index"定义了三个字段，分别是"field1"、"field2"和"field3"，并指定了它们的数据类型为"text"、"keyword"和"integer"。

2. **动态映射（可选）：** 如果你的文档中包含尚未定义的字段，Elasticsearch可以自动创建映射。这被称为动态映射。你可以通过设置索引的dynamic属性来控制动态映射的行为。例如，可以将dynamic设置为"strict"，表示禁止动态添加新字段：

```bash
PUT /my_index
{
  "mappings": {
    "dynamic": "strict",
    "properties": {
      ...
    }
  }
}
```

3. **更新映射（可选）：** 在索引创建后，你仍然可以更新映射以添加新的字段或修改现有字段的属性。你可以使用PUT映射API来执行此操作。

```bash
PUT /my_index/_mapping
{
  "properties": {
    "new_field": {
      "type": "text"
    }
  }
}
```

通过这些步骤，你可以定义索引中的字段属性，以确保索引中的数据按照你的预期进行存储和检索。

## ES index 会对字段有强制的校验吗？如果 index 中指定了字段，但是插入了不存在的字段怎么办？

在Elasticsearch中，默认情况下，索引不会对字段有强制的校验，这意味着你可以向索引中插入任何字段，即使这些字段未在映射中定义。

这种行为被称为动态映射（Dynamic Mapping），允许Elasticsearch自动根据插入的文档内容动态地创建字段映射。

然而，你可以通过显式定义索引映射的方式来控制字段的校验行为，包括字段类型、字段是否可为空、字段是否必须存在等。具体来说：

1. **Dynamic Mapping配置：** 你可以在创建索引或者更新映射时设置dynamic属性来控制动态映射的行为。常见的值包括true（默认，允许动态添加字段）、false（禁止动态添加字段）和strict（禁止动态添加字段并且当发现未知字段时抛出异常）。

2. **校验未知字段：** 如果在映射中定义了字段，但是插入文档时包含了未知的字段，Elasticsearch会根据dynamic属性的设置来处理。如果dynamic设置为strict，Elasticsearch会拒绝插入包含未知字段的文档，并返回相应的错误信息。如果dynamic设置为true，Elasticsearch会动态地添加新字段，并将未知字段的值存储在新添加的字段中。

要注意的是，在实际应用中，为了确保数据的一致性和完整性，通常建议显式定义索引映射，并将dynamic设置为false或strict，以避免意外的字段插入或数据类型错误。

这样可以更好地控制索引中的数据结构，减少数据处理中的不确定性。

## field 被存储了，那么 document 是如何存储的呢？

在Lucene中，Document是一组Field的集合，它代表了索引中的一个文档。

当您将文档添加到索引中时，Lucene会将这些字段的值存储在索引中，以便后续的检索操作。

Document并不是以类似关系型数据库的表格形式存储的，而是通过倒排索引的方式进行存储。

在倒排索引中，每个字段值都会被映射到文档列表，列表中包含了拥有这个字段值的所有文档的标识符。这样的设计使得Lucene能够高效地进行全文检索，快速地找到包含特定关键字的文档。

在内部，Lucene会将Document转换为一系列的倒排索引项（Inverted Index Entries）。

每个索引项包含了字段的值以及指向包含该值的文档的指针。这些索引项会被组织成一个倒排索引结构，并且根据字段值进行排序，以便进行快速的搜索。

当您执行搜索操作时，Lucene会根据查询条件在倒排索引中查找匹配的索引项，并且返回相关的文档标识符。

然后，通过文档标识符可以获取相应的文档，进而获取文档的各个字段值。

总的来说，Document的存储方式是基于倒排索引的，通过将字段的值映射到文档列表来实现高效的检索操作。

## boost 权限为什么要和 document 关联？不应该和 field 关联码？

在Lucene中，boost值可以与文档（Document）相关联，也可以与字段（Field）相关联。

实际上，boost值是用来指定文档或字段在搜索结果中的相关性权重的一个因素。

1. **与文档相关联的boost**：将boost与文档相关联意味着整个文档的相关性权重将会受到影响。当一个文档的boost值较高时，它的相关性将更加突出，可能会在搜索结果中排名更高。

2. **与字段相关联的boost**：将boost与字段相关联意味着只有特定字段的相关性权重受到影响。这样可以在同一个文档中对不同字段的相关性进行不同程度的强调。例如，标题字段可能比内容字段更重要，因此可以给标题字段设置较高的boost值。

通常情况下，如果您希望调整整个文档的相关性权重，可以将boost值与文档关联。

而如果您希望调整特定字段的相关性权重，可以将boost值与字段关联。这两种方式都提供了灵活性，可以根据需求对搜索结果进行调整。

## 为什么需要 documentId，实际有什么用呢？

文档标识符（Document ID）在Lucene中具有重要的作用，它用于唯一标识索引中的每个文档。

以下是一些文档标识符的实际用途：

1. **唯一标识文档**：文档标识符确保了每个文档在索引中具有唯一的标识。这对于在索引中准确地检索、更新或删除文档非常重要。通过文档标识符，可以精确地定位并操作索引中的特定文档。

2. **支持快速检索**：文档标识符通常用于在索引中快速检索文档。通过文档标识符，可以直接定位并获取索引中特定文档的信息，而无需遍历整个索引。

3. **与外部系统交互**：文档标识符可以用作与外部系统交互的标识符。例如，在使用Lucene作为搜索引擎时，文档标识符可以用作与数据库或其他存储系统中文档的关联键。

4. **支持分布式搜索**：在分布式搜索环境中，文档标识符对于在集群中的不同节点之间精确地定位和操作文档非常重要。每个文档的标识符可以被用来在集群中路由搜索请求，并确保正确地检索和处理文档。

总的来说，文档标识符是Lucene中的一个关键概念，它提供了文档在索引中的唯一标识，并支持对文档的快速检索、操作和与外部系统的交互。

## lucene 为什么要把字段的 store 和 index 区分开？有什么好处？

Lucene将字段的存储（store）和索引（index）属性分开是为了提高灵活性和效率，并允许根据不同的需求进行优化。

1. **灵活性**：将存储和索引属性分开使得用户能够更加灵活地控制字段的行为。

例如，可以选择仅索引字段而不存储其原始值，或者同时索引和存储字段。这种灵活性使得用户能够根据应用程序的具体需求进行优化，同时减少了不必要的资源消耗。

2. **索引效率**：将存储和索引分开可以提高索引的效率。如果一个字段的原始值不需要在搜索结果中返回，可以将其存储属性设置为NO，从而减少索引的大小。这可以减少内存占用和磁盘IO，并提高搜索性能。

3. **减少存储空间**：将存储属性设置为NO可以减少索引占用的存储空间。特别是对于大型文本字段，如果不需要在搜索结果中返回其原始值，可以只索引而不存储，从而节省大量的存储空间。

4. **隐私保护**：有些场景下，文档中的某些信息可能包含敏感数据，不希望在搜索结果中返回。通过将这些字段的存储属性设置为NO，可以确保敏感数据不会暴露在搜索结果中。

综上所述，将字段的存储和索引属性分开使得Lucene更加灵活、高效，并且能够满足不同场景下的需求，从而提高了搜索引擎的性能和可用性。



# 参考资料

* any list
{:toc}