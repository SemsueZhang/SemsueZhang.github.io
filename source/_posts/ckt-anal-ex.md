---
title: 电路基础习题选做
date: 2026-03-09 17:30:04
categories: Exercises
mathjax: true
---

课程编码：DCS2026. 

课程名称：电路理论基础 （一）. 

所选教材：电路基础（原书第6版），机械工业出版社，2018.9；ISBN 978-7-111-61076-2. 

授课学期：26 春季

这学期选的专选课，内容偏物理电路（和模电还不太一样）那一块的内容. 本文主要为作业题的记录.

## 第一部分 直流电路

### 第一章 基本概念

题目：

#### 1.18

> ![Prob. 1.18](/images/电路习题选做/1-18.png)

- 元件P1：$I_1=-10\ \text{A}$，$U_1=30\ \text{V}$，$P_1=-I_1U_1=-300\ \text{W}$
- 元件P2：$I_2=10\ \text{A}$（正流入），$U_2=10\ \text{V}$，$P_2=I_2U_2=100\ \text{W}$
- 元件P3：$I_3=14\ \text{A}$（正流入），$U_3=20\ \text{V}$，$P_3=I_3U_3=280\ \text{W}$
- 元件P4：$I_4=4\ \text{A}$（反流入），$U_4=8\ \text{V}$，$P_4=-I_4U_4=-32\ \text{W}$
- 元件P5：$I_5=4\ \text{A}$（反流入），$U_5=12\ \text{V}$，$P_5=-I_5U_5=-48\ \text{W}$

**功率平衡验证**：

$(-300-32-48)+(100+280)=0$

#### 1.20

> ![Prob. 1.20](/images/电路习题选做/1-20.png)

- 30V电源：$P=6\ \text{A} \cdot 30\ \text{V}=-180\ \text{W}$
- 由KVL得：$30=12+V_o \implies V_o=18\ \text{V}$
- 12V元件：$P=12\ \text{V} \cdot 6\ \text{A}=72\ \text{W}$
- 28V元件（2A支路）：$P=28\ \text{V} \cdot 2\ \text{A}=56\ \text{W}$
- 28V元件（1A支路）：$P=28\ \text{V} \cdot 1\ \text{A}=28\ \text{W}$
- $V_o(18\ \text{V})$元件：$P=18\ \text{V} \cdot 3\ \text{A}=54\ \text{W}$
- 受控电压源：$P=-5 \times 2 \times 3\ \text{A}=-30\ \text{W}$


#### 1.23

> ![Prob. 1.23](/images/电路习题选做/1-23.png)

$$
\begin{equation*}
\begin{aligned}
\text{Cost} &= P \cdot t \cdot \text{cent/kWh} \\
&=1.8 \text{kW} \times 0.25 \text{h} \times 30 \text{d} \times 10 \text{cent/kWh} \\
&=135 \text{cents} \\
&=1.35$
\end{aligned}
\end{equation*}
$$

#### 1.36

> ![Prob. 1.36.1](/images/电路习题选做/1-36-1.png)
>
> ![Prob. 1.36.2](/images/电路习题选做/1-36-2.png)

- (a) 最大电流计算
$$
I=\frac{Q}{t}=\frac{20\ \text{Ah}}{0.25\ \text{h}}=80\ \text{A}
$$

- (b) 放电时长计算
$$
t=\frac{Q}{I}=\frac{20\ \text{Ah}}{2\ \text{mA}}=10^4\ \text{h} \approx 417\ \text{天}
$$

pdf 版解答：

<iframe src="/pdf/电路chap1.pdf" style="width: 100%; height: 500px;" frameborder="0"></iframe>