---
layout: klut
title: K-LUT Mapper
date: 2026-03-02 12:39:16
categories: Articles
mathjax: true
---

## Todo List

- 从 blif 格式文件读入，并存储进图结构中。
- ~~将 LUT 节点映射输出，并得到真值表。~~
- 按照原有 blif 格式输出映射后的 LUTs。
- 并行化。
- 整理文档。

## Introduction

Techenology Mapping is an important step in the FPGA design flow, which maps the logic design to the target FPGA architecture. Our $k$-LUT Mapper is a tool that performs technology mapping using $k$-input Look-Up Tables (we use $4$-LUT as example) as the basic building blocks. This mapper focuses on optimizing the mapping process to achieve better performance(especially minimization of area) and efficiency.

Look Up Tables (LUTs) are a fundamental component in FPGA architectures, allowing for the implementation of combinational logic functions. $K$-LUTs can implement any **Boolean function** of $k$ variables.

We have implemented a $k$-LUT Mapper that takes a logic design(blif format) as input and produces a mapped netlist. The mapper uses algorithms based on cut enumeration and randomized iteration.

## Related Work

Our method is an improvement over AGDMap[$1$], which efficiently overcame the structural bias problem of cut enumeration algorithms. However, the efficiency of AGGMap needs improvement. We have implemented a $k$-LUT Mapper that uses a randomized iteration method to further optimize the mapping process. This approach allows us to explore a larger solution space and find better mappings, resulting in improved performance and reduced area.

## Main Algorithm

The main algorithm of our $k$-LUT Mapper consists of the following steps:

### Initialization

We convert the graph into an AIG (And-Inverter Graph), which is a directed acyclic graph containing only two-input AND and NOT gates. By converting the graph into an AIG, we can omit handling wide-cuts and processing bin-package algorithm.

### Cut Enumeration

**Definition(Cut)**: A cut of a node $v$ is a set of nodes that can be used to implement the logic function of v. A $k$-feasible cut is a cut that contains at most $k$ nodes.

其中割还有一个重要指标面积，用来反映大致需要的 LUT 数量。

**Definition(Cone)**: A cone of a cut of node $v$ is the subgraph that contains all the nodes that can reach $v$ and be reached by the nodes in the cut.

#### Cut Merging

我们可以通过合并 $v\in Fanin(u)$ 的割来得到 u 的割。

具体来讲，设 $L$ 是目前 $u$ 的割的集合，依次枚举 $v \in Fanin(u)$，将 $L$ 中的每个割与 $v$ 的割进行合并，得到新的割集合 $L'$，然后将 $L'$ 赋值给 $L$。合并的过程中，如果某个割的大小超过 $k$，则舍弃该割。

在合并来自 $v_1,v_2$ 的割 $c_1,c_2$ 时，通过一下公式计算新的割的面积：

$$
A_c=\dfrac{c_1}{fanout(v_1)}+\dfrac{c_2}{fanout(v_2)}+1.0
$$

其中 $fanout(v)$ 是节点 $v$ 的输出连接的节点数量。

#### Cut Pruning

在枚举完割之后，我们需要对割进行剪枝，以减少后续的计算量。剪枝的标准是割的面积，面积较大的割被**认为**是较差的选择（事实上不一定），因此我们保留面积较小的割。同时，还需要根据割的大小区分，保留不同大小的割，以保证后续的映射过程中有足够的选择。

### Randomized Iteration

#### 迭代

每轮迭代从输出节点开始，依次向输入节点进行映射。对于每个节点 $u$，我们从 $u$ 的割集合中选择一个 $cost$ 最小的割 $c$ 进行映射。其中 $cost$ 的计算公式如下：

$$
cost(c)=1.0 + \sum_{v\in c}\dfrac{bestcost(v)}{fanout(v)}
$$

其中 $bestcost(v)$ 是节点 $v$ 上一轮迭代的最佳映射代价，$fanout(v)$ 是节点 $v$ 的输出连接的节点数量。

#### 随机扰动

为了避免陷入局部最优解，我们在每轮迭代中引入随机扰动。在计算 $cost$ 的过程中，我们加上 $[-0.1,0.1]$ 内的一个随机数，以增加算法的探索能力。

#### 随机选择

在每轮迭代中，我们直接选择 $cost$ 最小的割，而是以 $P_{i,j}=\exp(-j/i)$ 的概率选择第 $j$ 小的割，其中 $i$ 是当前迭代轮数，$j$ 是割的序号。这样可以增加算法的随机性，避免陷入局部最优解。

## Implementation Details

## References

[1] Longfei Fan, Chang Wu. 2023. "FPGA Technology Mapping with Adaptive Gate Decomposition". Proceedings of the 2023 ACM/SIGDA International Symposium on Field Programmable Gate Arrays (FPGA 2023).