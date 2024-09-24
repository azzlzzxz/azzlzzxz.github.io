# Lane 模型

`React`中用`lane(赛道)模型`来表示任务优先级，使用`31`位的二进制表示`31`条赛道，也就是一共有`31条`优先级，数字越小优先级越高，某些赛道的优先级相同，[<u>`clz32`</u>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32)函数返回开头的 `0` 的个数

::: tip `React` 里的优先级

- 赛道优先级（也就是本文的`lane`赛道模型）

- 事件优先级（把赛到优先级的二进制通过`lanesToEventPriority`这个函数，转成对应的`Scheduler`优先级）[<u>源码地址 ｜ 事件优先级 ｜ react-reconciler/src/ReactEventPriorities.js</u>](https://github.com/azzlzzxz/react-source-code/blob/3d95c43b8967d4dda1ec9a22f0d9ea4999fee8b8/packages/react-reconciler/src/ReactEventPriorities.js)

- [<u>`Scheduler`优先级</u>](/docs/rsource/react/schedule.md)

:::

`lane` 代表的优先级

> 这里只展示一些，完整的`lane`优先级标识可以看[<u>源码地址 ｜ lane 优先级标识</u>](https://github.com/azzlzzxz/react-source-code/blob/main/packages/react-reconciler/src/ReactFiberLane.js)

```js
xport const NoLanes: Lanes = /*                        */ 0b0000000000000000000000000000000;
export const NoLane: Lane = /*                          */ 0b0000000000000000000000000000000;

export const SyncLane: Lane = /*                        */ 0b0000000000000000000000000000001;
export const SyncBatchedLane: Lane = /*                 */ 0b0000000000000000000000000000010;

export const InputDiscreteHydrationLane: Lane = /*      */ 0b0000000000000000000000000000100;
const InputDiscreteLanes: Lanes = /*                    */ 0b0000000000000000000000000011000;

const InputContinuousHydrationLane: Lane = /*           */ 0b0000000000000000000000000100000;
const InputContinuousLanes: Lanes = /*                  */ 0b0000000000000000000000011000000;

export const DefaultHydrationLane: Lane = /*            */ 0b0000000000000000000000100000000;
export const DefaultLanes: Lanes = /*                   */ 0b0000000000000000000111000000000;

const TransitionHydrationLane: Lane = /*                */ 0b0000000000000000001000000000000;
const TransitionLanes: Lanes = /*                       */ 0b0000000001111111110000000000000;

const RetryLanes: Lanes = /*                            */ 0b0000011110000000000000000000000;

export const SomeRetryLane: Lanes = /*                  */ 0b0000010000000000000000000000000;

export const SelectiveHydrationLane: Lane = /*          */ 0b0000100000000000000000000000000;

const NonIdleLanes = /*                                 */ 0b0000111111111111111111111111111;

export const IdleHydrationLane: Lane = /*               */ 0b0001000000000000000000000000000;
const IdleLanes: Lanes = /*                             */ 0b0110000000000000000000000000000;

export const OffscreenLane: Lane = /*                   */ 0b1000000000000000000000000000000;
```

## 优先级相关计算

既然`lane`对应了二进制的位，那么优先级相关计算其实就是[<u>位运算 🚀</u>](/rsource/react/preknowledge.md#位运算符)

> 举几个源码中的 🌰

- 计算`a`、`b`两个`lane`是否存在交集，只需要判断`a`与`b`按位与的结果是否为`0`

```js
export function includesSomeLane(a: Lanes | Lane, b: Lanes | Lane) {
  return (a & b) !== NoLanes
}
```

- 计算`b`这个`lanes`是否是`a`对应的`lanes`的子集，只需要判断`a`与`b`按位与的结果是否为`b`

```js
export function isSubsetOfLanes(set: Lanes, subset: Lanes | Lane) {
  return (set & subset) === subset
}
```

- 将两个`lane`或`lanes`的位合并只需要执行按位或操作

```js
export function mergeLanes(a: Lanes | Lane, b: Lanes | Lane): Lanes {
  return a | b
}
```

- 从`set`对应`lanes`中移除`subset`对应`lane`（或`lanes`），只需要对`subset`的`lane`（或`lanes`）执行按位非，结果再对`set`执行按位与

```js
export function removeLanes(set: Lanes, subset: Lanes | Lane): Lanes {
  return set & ~subset
}
```
