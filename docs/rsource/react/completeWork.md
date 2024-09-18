# completeWork

`performUnitOfWork` 函数每次会调用 `beginWork` 来创建当前节点的子节点，如果当前节点没有子节点，则说明当前节点是一个叶子节点。在前面我们已经知道，当遍历到叶子节点时说明当前节点 `“递”` 阶段 的工作已经完成，接下来就要进入 `“归”` 阶段 ，即通过 `completeUnitOfWork` 执行当前节点对应的 `completeWork` 逻辑
