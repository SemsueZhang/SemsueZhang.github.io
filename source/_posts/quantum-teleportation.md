---
title: 量子隐形传态
data: 2026-06-01
categories: Articles
---

## Introduction

假设 A 有一个量子比特 $\ket\psi=\alpha\ket0+\beta\ket1$ 想要传递给 B，但是 A 有可能不知道 $\alpha$ 和 $\beta$ 的值。需要一个不进行测量，不利用额外经典比特的方式来传递这个量子比特（还有可能这个比特和其他比特发生了纠缠）。量子隐形传态通过给双方一个 e-bit 作为资源，A 通过一些经典信息将 $\ket\psi$ 的状态传递给 B。

## Quantum Teleportation Protocol

### Bell State

贝尔态是两个量子比特的最大纠缠态，构成两量子比特希尔伯特空间的完备正交基，定义如下：

$$
\ket{\Psi^{\pm}} = \frac{1}{\sqrt{2}}(\ket{00} \pm \ket{11})\\
\ket{\Phi^{\pm}} = \frac{1}{\sqrt{2}}(\ket{01} \pm \ket{10})
$$

还有一种把四种贝尔态表示成 $\ket{\beta_{ij}}$ 写法。

#### 制备

### 泡利算符

泡利算符是量子计算中的基本操作，定义如下：

$$
X = \begin{bmatrix}0 & 1\\1 & 0\end{bmatrix},\quad
Y = \begin{bmatrix}0 & -i\\i & 0\end{bmatrix},\quad
Z = \begin{bmatrix}1 & 0\\0 & -1\end{bmatrix}
$$