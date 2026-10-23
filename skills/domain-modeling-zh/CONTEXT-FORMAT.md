# CONTEXT.md 格式

## 结构

```md
# {Context Name}

{One or two sentence description of what this context is and why it exists.}

## Language

**Order**:
{A one or two sentence description of the term}
_Avoid_: Purchase, transaction

**Invoice**:
A request for payment sent to a customer after delivery.
_Avoid_: Bill, payment request

**Customer**:
A person or organization that places orders.
_Avoid_: Client, buyer, account
```

## 规则

- **要有立场。** 当同一概念存在多个词时，挑最好的那个，并把其余列在 `_Avoid_` 下。
- **定义要精炼。** 最多一两句话。定义它是什么，而不是它做什么。
- **只收录本项目 context（上下文）特有的术语。** 一般编程概念（timeouts、error types、utility patterns）即使项目大量使用也不该收录。添加术语之前先问：这个概念是本上下文独有的，还是一般编程概念？只有前者才收录。
- **当自然形成分组时，用子标题给术语分组。** 如果所有术语都属于同一个内聚领域，平铺列表即可。

## 单上下文与多上下文仓库

**单上下文（大多数仓库）：** 在仓库根目录放一个 `CONTEXT.md`。

**多上下文：** 在仓库根目录放一个 `CONTEXT-MAP.md`，列出各上下文、它们所在的位置以及彼此之间的关系：

```md
# Context Map

## Contexts

- [Ordering](./src/ordering/CONTEXT.md): receives and tracks customer orders
- [Billing](./src/billing/CONTEXT.md): generates invoices and processes payments
- [Fulfillment](./src/fulfillment/CONTEXT.md): manages warehouse picking and shipping

## Relationships

- **Ordering → Fulfillment**: Ordering emits `OrderPlaced` events; Fulfillment consumes them to start picking
- **Fulfillment → Billing**: Fulfillment emits `ShipmentDispatched` events; Billing consumes them to generate invoices
- **Ordering ↔ Billing**: Shared types for `CustomerId` and `Money`
```

本技能推断适用哪种结构：

- 如果存在 `CONTEXT-MAP.md`，读它来找到各上下文
- 如果只有根目录的 `CONTEXT.md`，就是单上下文
- 如果两者都不存在，在第一个术语被确定时惰性创建根目录的 `CONTEXT.md`

当存在多个上下文时，推断当前主题与哪个相关。如果不清楚，就问。
