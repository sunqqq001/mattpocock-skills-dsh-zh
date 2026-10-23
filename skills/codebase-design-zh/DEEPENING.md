# 加深（Deepening）

在已知其依赖的情况下，如何安全地加深一个由浅模块组成的 cluster（集群）。假定读者了解 [SKILL.md](SKILL.md) 中的词汇：**module（模块）**、**interface（接口）**、**seam（接缝）**、**adapter（适配器）**。

## 依赖类别（Dependency categories）

评估一个加深候选时，先对其依赖分类。类别决定加深后的模块如何跨其 seam（接缝）被测试。

### 1. 进程内（In-process）

纯计算、内存状态、无 I/O。总是可加深：合并这些模块，直接通过新 interface（接口）测试。无需 adapter（适配器）。

### 2. 本地可替换（Local-substitutable）

有本地测试替身的依赖（Postgres 用 PGLite、内存文件系统）。如果替身存在，就可加深。加深后的模块在测试套件中运行替身来进行测试。seam（接缝）是内部的；模块的外部 interface（接口）处没有 port（端口）。

### 3. 远程但自有（Ports & Adapters，端口与适配器）

跨网络边界（微服务、内部 API）的你自己的服务。在 seam（接缝）处定义一个 **port（端口）**（即 interface）。深模块拥有逻辑；传输层作为 **adapter（适配器）** 注入。测试使用内存 adapter，生产环境使用 HTTP/gRPC/队列 adapter。

推荐表述：*"在 seam 处定义 port，为生产实现 HTTP adapter、为测试实现内存 adapter，这样逻辑就集中在一个深模块中，即使它部署在网络各处。"*

### 4. 真正的外部依赖（Mock，模拟）

你无法控制的第三方服务（Stripe、Twilio 等）。加深后的模块把外部依赖作为注入的 port（端口）接收；测试提供模拟 adapter。

## 接缝纪律（Seam discipline）

- **一个 adapter 意味着假想的 seam；两个 adapter 意味着真实的 seam。** 除非至少有两个 adapter 站得住脚（通常是生产 + 测试），否则不要引入 port。只有一个 adapter 的 seam 只是间接层。
- **内部 seam 与外部 seam。** 一个深模块既可以有 internal seams（内部接缝）（对 implementation 私有，由其自身测试使用），也可以有位于 interface 处的 external seam（外部接缝）。不要仅仅因为测试用到了内部 seam，就通过 interface 把它们暴露出去。

## 测试策略：替换，而非分层（Testing strategy: replace, don't layer）

- 一旦加深后的模块 interface 处有了测试，浅模块上的旧单元测试就成了废料；删除它们。
- 在加深后的模块 interface 处写新测试。**Interface 就是测试面。**
- 测试通过 interface 断言可观察的结果，而不是内部状态。
- 测试应当经受得住内部重构，因为它们描述的是行为，而非实现。如果一个测试必须随着实现的改变而改变，那它就是在越过 interface 测试。
