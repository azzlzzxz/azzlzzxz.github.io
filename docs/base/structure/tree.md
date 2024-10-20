# 树 🌲

## 树形结构

像数组、栈、队列、默认都是线性结构类型。常见的树形结构有二叉树和多叉树（大于两个叉的树）。

开发中常见的树形结构有:  文件夹目录、`DOM` 结构、路由的配置...... （树的数据结构是非常重要的）。

常见概念：

- 节点 （根节点、父节点、子节点、兄弟节点）
- 子树 （左子树、右子树）,子树的个数称之为度
- 叶子节点 （深度为 `0` 的节点） 非叶子节点 （深度不为 `0` 的节点）
- 节点的深度 （从根节点到当前节点所经过的节点总数）
- 节点的高度 （从当前节点到最远叶子节点经过的节点总数）
- 树的层数 （树的高度、树的深度）
- 有序树 （节点按照顺序排列）、无序树

## 二叉树

二叉树是每个结点最多有两个子树的树结构 ，每个节点的度最多为 `2`。 通常子树被称作“左子树”`（left subtree）`和“右子树”`（right subtree）` ，左子树和右子树是有顺序的。

### 二叉树的常见概念

- 真二叉树

  - 节点数：每个节点都有 `0` 或 `2` 个子节点。这意味着每个非叶子节点都有两个子节点，而每个叶子节点没有子节点。

  - 层次：在真二叉树中，除了最后一层外，所有层都是完全填充的。也就是说，所有的父节点都有两个子节点，最后一层的叶子节点都在最左边。

```markdown
         1
       /   \
      2     3
     / \   / \
    4   5 6   7
```

- 满二叉树：满二叉树也是真二叉树，且所有的叶子节点都在最后一层

- 完全二叉树： 深度为`k`的有`n`个结点的二叉树，对树中的结点按从上至下、从左到右的顺序进行编号，如果编号为`i（1≤i≤n）`的结点与满二叉树中编号为`i`的结点在二叉树中的位置相同，则这棵二叉树称为完全二叉树。

### 二叉树的存储方式

- 链式存储法（链表）：

每个节点包含三个部分：左子节点、节点值、右子节点。每个节点的左、右节点是指向其子节点的指针。

适用于树结构较为复杂的情况

```js
class TreeNode {
  constructor(val) {
    this.val = val
    this.left = null
    this.right = null
  }
}
```

- 顺序存储法（数组）

用数组存储二叉树时，根节点存储在数组索引为 `1` 的位置（也可以是索引为 `0`），左子节点位于 `2*i` 位置，右子节点位于 `2*i + 1` 位置。

适用于树的深度较小、稠密的情况，常用于完全二叉树。

```js
const tree = [null, 1, 2, 3, 4, 5, 6, 7] // 使用数组表示完全二叉树
```

### 二叉树的遍历方式

常见的二叉树遍历的四种方式:

- 前序遍历 `Preorder Traversal`(先访问根节点、前序遍历左子树、前序遍历右子树)（父 --> 左 --> 右）

- 中序遍历  `Inorder Traversal`(中序遍历左子树、根节点、中序遍历右子树)（左 --> 父 --> 右 ）（只有中序遍历后的结果是有顺序的）

- 后续遍历  `Postorder Traversal`(后序遍历左子树、后续遍历右子树、根节点)（左 --> 右 --> 父）

- 层序遍历  `Level Order Traversal` (从上到下，从左到右依次访问每一个节点)

![tree_for](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/tree_for.png)

```js
class Node {
  constructor(element, parent) {
    this.element = element
    this.parent = parent
    this.left = null
    this.right = null
  }
}
class BST {
  constructor() {
    this.root = null
    this.size = 0
  }
  add(element) {
    if (this.root === null) {
      this.root = new Node(element, null)
      this.size++
      return
    }
    let currentNode = this.root
    let compare = null
    let parent = null
    while (currentNode) {
      compare = element - currentNode.element
      parent = currentNode
      if (compare > 0) {
        currentNode = currentNode.right
      } else if (compare < 0) {
        currentNode = currentNode.left
      }
    }
    let newNode = new Node(element, parent)
    if (compare > 0) {
      parent.right = newNode
    } else if (compare < 0) {
      parent.left = newNode
    }
    this.size++
  }
  preorderTraversal(visitor) {
    const traveral = (node) => {
      if (node === null) return
      visitor.visit(node)
      // --> console.log(node.element) // 父
      traveral(node.left) // 左
      traveral(node.right) // 右
    }
    traveral(this.root)
  }
  inorderTraversal(visitor) {
    const traveral = (node) => {
      if (node === null) return
      traveral(node.left) // 左
      visitor.visit(node)
      // console.log(node.element) // 父
      traveral(node.right) // 右
    }
    traveral(this.root)
  }
  postorderTraversal(visitor) {
    const traveral = (node) => {
      if (node === null) return
      traveral(node.left) // 左
      traveral(node.right) // 右
      visitor.visit(node)
      // console.log(node.element) // 父
    }
    traveral(this.root)
  }
  levelorderTraversal(visitor) {
    // 先把根节点放入[10]，指针指向10 找根节点的左右子节点 放进去，
    // [10, 8, 19]，指针指向8 找其节点的左右子节点 放进去，
    // [10, 8, 19]，指针指向19 找其节点的左右子节点 放进去 。。。一直这样找，就是一层层的push
    if (node === null) return
    let stack = [this.root]
    let currentNode = null
    let index = 0
    while ((currentNode = stack[index++])) {
      visitor.visit(currentNode)
      if (currentNode.left) {
        stack.push(currentNode.left)
      }
      if (currentNode.right) {
        stack.push(currentNode.right)
      }
    }
  }
}
let bst = new BST()
let arr = [10, 8, 19, 6, 15, 22, 20]
arr.forEach((item) => {
  bst.add(item)
})
// 访问者模式 (babel内部转化都是使用的这种方式（说白了就是回调）)
bst.preorderTraversal({
  visit(node) {
    console.log(node.element)
  },
})
```

#### 深度优先（DFS）

深度优先搜索英文缩写为 `DFS` 即 `Depth First Search`。
其过程简要来说是对每一个可能的分支路径深入到不能再深入为止，而且每个节点只能访问一次。
应用场景：

- `React` 虚拟 `DOM` 的构建
- `React` 的 `fiber` 树构建

![DFS](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/DFS.jpg)

#### 广度优先（BFS）

宽度优先搜索算法（又称广度优先搜索），其英文全称是 Breadth First Search。
算法首先搜索距离为 k 的所有顶点，然后再去搜索距离为 k+l 的其他顶点。

![BFS](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/BFS.jpg)

## 二叉搜索树

::: tip 什么是二叉搜索树？

- 一般情况下存储数据我们可以采用数组的方式，但是从数组中检索数据的时间复杂度是`O(n)`，如果数据存储有序，则可以采用二分查找的方式来检索数据，复杂度为：`O(logn)`，但是如果操作数组中的数据像增加、删除默认数组会产生塌陷。时间复杂度为 `O(n)`

- 二叉搜索树中查询、增加、删除复杂度最坏为 `O(logn)`，特性是当它的左子树不空，则左子树上所有结点的值均小于它的根结点的值，当右子树不空，则右子树上所有结点的值均大于它的根结点的值。

:::

> 也称为：二叉查找树或二叉排序树

### 二叉搜索树的主要操作

二叉搜索树中的数据必须具有可比较性：

- `add` 添加元素

- `remove` 删除元素
- `size` 元素个数
- `contains` 包含元素

**树是没有索引的，不能通过索引来检索数据**

### 实现二叉搜索树

![tree_one](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/tree_one.png)

```js
class Node {
  // 节点直接必须有一个parent
  constructor(element, parent) {
    this.element = element
    this.parent = parent // 记录当前节点的父亲是谁
    this.left = null
    this.right = null
  }
}

class BST {
  constructor() {
    this.root = null // 根节点
    this.size = 0 // 树里节点的个数
  }
  add(element) {
    if (this.root === null) {
      // 根节点为null,放入的第一个元素作为根节点
      this.root = new Node(element, null)
      this.size++
      return
    }

    let currentNode = this.root // 从根开始进行查找
    // 记录最后一次循环的currentNode为parent
    let parent = null
    // 不是根节点，就要利用规则来把后续的元素分别放到 左/右 树叉上
    let compare = null
    // 根据根的来比较插入
    // 根据条件不停的找 找到节点为空时 将上一次的值保存起来。将节点插入到保存的节点中
    // 从根节点向下，循环，直到currentNode为null停止，记录最后一次循环的currentNode为parent，之后在向其添加子节点
    while (currentNode) {
      parent = currentNode // parent就是在进入左右子树之前保存下来的节点
      compare = element - currentNode.element
      // 规则是大于根的放右，小于放左
      if (compare > 0) {
        currentNode = currentNode.right //查找的根节点以右边节点的为基准
      } else {
        currentNode = currentNode.left //查找的根节点以左边节点的为基准
      }
    }
    // 创建新的自节点
    let newNode = new Node(element, parent)

    // 这时已经得到了需要向其添加子节点的 parent
    // 根据compare 判断是向 左 / 右 树叉上加子节点
    if (compare > 0) {
      parent.right = newNode
    } else if (compare < 0) {
      parent.left = newNode
    }

    this.size++
  }
}

let bst = new BST()
let arr = [10, 8, 6, 19, 15, 22, 20]
// 二叉树必须要有一个规则，作为形成二叉的缘由
arr.forEach((item) => {
  bst.add(item)
})
console.dir(bst, { depth: 10 })
```

![tree_log](https://steinsgate.oss-cn-hangzhou.aliyuncs.com/tree_log.png)

### 二叉树的翻转

> 翻转二叉树的核心就是树的遍历 + 左右节点互换而已

```js
class Node {
  constructor(element, parent) {
    this.element = element
    this.parent = parent
    this.left = null
    this.right = null
  }
}
class BST {
  constructor() {
    this.root = null
    this.size = 0
  }
  add(element) {
    if (this.root === null) {
      this.root = new Node(element, null)
      this.size++
      return
    }
    let currentNode = this.root
    let compare = null
    let parent = null
    while (currentNode) {
      compare = element - currentNode.element
      parent = currentNode
      if (compare > 0) {
        currentNode = currentNode.right
      } else if (compare < 0) {
        currentNode = currentNode.left
      }
    }
    let newNode = new Node(element, parent)
    if (compare > 0) {
      parent.right = newNode
    } else if (compare < 0) {
      parent.left = newNode
    }
    this.size++
  }
  invertTree() {
    if (node === null) return
    let stack = [this.root]
    let currentNode = null
    let index = 0
    while ((currentNode = stack[index++])) {
      // 循环每次 存左 左 = 右 右 = 存左
      let temp = currentNode.left
      currentNode.left = currentNode.right
      currentNode.right = temp
      if (currentNode.left) {
        stack.push(currentNode.left)
      }
      if (currentNode.right) {
        stack.push(currentNode.right)
      }
    }
  }
}
let bst = new BST()
let arr = [10, 8, 19, 6, 15, 22, 20]
arr.forEach((item) => {
  bst.add(item)
})
bst.invertTree()
```
