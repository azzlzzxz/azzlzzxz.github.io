# 代码规范

## 变量

### 使用有意义、更易读的命名

```javascript
// Bad
const yyyymmdstr = moment().format('YYYY/MM/DD')
// Good
const currentDate = moment().format('YYYY/MM/DD')
```

### 对于相同类型的变量使用相同的词汇

```javascript
// Bad
getUserInfo()
getClientData()
getCustomerRecord()

// Good
getUser()
```

### 可搜索的命名

在职业生涯中，其实我们读的代码会比我们写的代码更多，所以编写可读性强和可搜索的代码是非常重要的。像[ESLint](https://github.com/eslint/eslint/blob/660e0918933e6e7fede26bc675a0763a6b357c94/docs/rules/no-magic-numbers.md)可以帮助识别未命名的常量。

```javascript
// Bad
setTimeout(blastOff, 86400000)

// Good
const MILLISECONDS_IN_A_DAY = 86400000
setTimeout(blastOff, MILLISECONDS_IN_A_DAY)
```

### 使用解释性变量

```javascript
// Bad
const address = 'One Infinite Loop, Cupertino 95014'
const cityZipCodeRegex = /^[^,\\]+[,\\\s]+(.+?)\s*(\d{5})?$/
saveCityZipCode(address.match(cityZipCodeRegex)[1], address.match(cityZipCodeRegex)[2])

// Good
const address = 'One Infinite Loop, Cupertino 95014'
const cityZipCodeRegex = /^[^,\\]+[,\\\s]+(.+?)\s*(\d{5})?$/
const [_, city, zipCode] = address.match(cityZipCodeRegex) || []
saveCityZipCode(city, zipCode)
```

### 使用含义明确的变量

```javascript
// Bad
const locations = ['Austin', 'New York', 'San Francisco']
locations.forEach((l) => {
  doStuff()
  doSomeOtherStuff()
  // ...
  dispatch(l)
})

// Good
const locations = ['Austin', 'New York', 'San Francisco']
locations.forEach((location) => {
  doStuff()
  doSomeOtherStuff()
  // ...
  dispatch(location)
})
```

### 不要添加不必要的上下文

如果你的类/对象名称告诉你一些东西，不要在变量名中重复。

```javascript
// Bad
const Car = {
  carMake: 'Honda',
  carModel: 'Accord',
  carColor: 'Blue',
}
function paintCar(car) {
  car.carColor = 'Red'
}

// Good
const Car = {
  make: 'Honda',
  model: 'Accord',
  color: 'Blue',
}
function paintCar(car) {
  car.color = 'Red'
}
```

### 使用默认值

函数将只为未定义的参数提供默认值。其他“假”值，如''、`false`、`null`、0 和`NaN`，不会被默认值取代。

```javascript
// Bad
function createMicrobrewery(name) {
  const breweryName = name || 'Hipster Brew Co.'
  // ...
}

// Good
function createMicrobrewery(name = 'Hipster Brew Co.') {
  // ...
}
```

## 函数

### 参数（理想情况下 2 个或更少）

限制函数参数的数量是非常重要的，因为它使测试函数更容易。

要明确函数需要什么属性，可以使用`ES2015/ES6`的解构语法：

```javascript
// Bad
function createMenu(title, body, buttonText, cancellable) {
  // ...
}
createMenu('Foo', 'Bar', 'Baz', true)

// Good
function createMenu({ title, body, buttonText, cancellable }) {
  // ...
}
createMenu({
  title: 'Foo',
  body: 'Bar',
  buttonText: 'Baz',
  cancellable: true,
})
```

### 单一职责

这是到目前为止软件工程中最重要的规则。当函数做不止一件事情时，它们就更难组合、测试和推理。当你将一个函数隔离为一个动作时，就可以很容易地重构它，你的代码读起来也会更清晰。

```javascript
// Bad
function emailClients(clients) {
  clients.forEach((client) => {
    const clientRecord = database.lookup(client)
    if (clientRecord.isActive()) {
      email(client)
    }
  })
}

// Good
function emailActiveClients(clients) {
  clients.filter(isActiveClient).forEach(email)
}
function isActiveClient(client) {
  const clientRecord = database.lookup(client)
  return clientRecord.isActive()
}
```

```javascript
// Bad
function parseBetterJSAlternative(code) {
  const REGEXES = [
    // ...
  ]
  const statements = code.split(' ')
  const tokens = []

  REGEXES.forEach((REGEX) => {
    statements.forEach((statement) => {
      // ...
    })
  })

  const ast = []

  tokens.forEach((token) => {
    // lex...
  })
  ast.forEach((node) => {
    // parse...
  })
}

// Good
function parseBetterJSAlternative(code) {
  const tokens = tokenize(code)
  const syntaxTree = parse(tokens)
  syntaxTree.forEach((node) => {
    // parse...
  })
}

function tokenize(code) {
  const REGEXES = [
    // ...
  ]
  const statements = code.split(' ')
  const tokens = []

  REGEXES.forEach((REGEX) => {
    statements.forEach((statement) => {
      tokens.push(/* ... */)
    })
  })
  return tokens
}

function parse(tokens) {
  const syntaxTree = []
  tokens.forEach((token) => {
    syntaxTree.push(/* ... */)
  })
  return syntaxTree
}
```

###   命名语义化

```javascript
// Bad
function addToDate(date, month) {
  // ...
}
const date = new Date()
addToDate(date, 1)

// Good
function addMonthToDate(month, date) {
  // ...
}
const date = new Date()
addMonthToDate(1, date)
```

### 删除冗余、重复代码

找出相同点，用一个 `function` / `module` / `class` 来处理不同的部分。
糟糕的抽象可能比重复代码更糟糕，所以要小心！

```javascript
// Bad
function showDeveloperList(developers) {
  developers.forEach((developer) => {
    const expectedSalary = developer.calculateExpectedSalary()
    const experience = developer.getExperience()
    const githubLink = developer.getGithubLink()
    const data = {
      expectedSalary,
      experience,
      githubLink,
    }
    render(data)
  })
}
function showManagerList(managers) {
  managers.forEach((manager) => {
    const expectedSalary = manager.calculateExpectedSalary()
    const experience = manager.getExperience()
    const portfolio = manager.getMBAProjects()
    const data = {
      expectedSalary,
      experience,
      portfolio,
    }
    render(data)
  })
}

// Good
function showEmployeeList(employees) {
  employees.forEach((employee) => {
    const expectedSalary = employee.calculateExpectedSalary()
    const experience = employee.getExperience()
    const data = {
      expectedSalary,
      experience,
    }
    switch (employee.type) {
      case 'manager':
        data.portfolio = employee.getMBAProjects()
        break
      case 'developer':
        data.githubLink = employee.getGithubLink()
        break
    }
    render(data)
  })
}
```

### 利用 `Object.assign` / 字面量语法 设置默认对象

```javascript
// Bad
const menuConfig = {
  title: null,
  body: "Bar",
  buttonText: null,
  cancellable: true
};
function createMenu(config) {
  config.title = config.title || "Foo";
  config.body = config.body || "Bar";
  config.buttonText = config.buttonText || "Baz";
  config.cancellable =
    config.cancellable !== undefined ? config.cancellable : true;
}
createMenu(menuConfig);

// Good
const menuConfig = {
  title: "Order",
  // User did not include 'body' key
  buttonText: "Send",
  cancellable: true
};
function createMenu(config) {
  let finalConfig = Object.assign(
    {
      title: "Foo",
      body: "Bar",
      buttonText: "Baz",
      cancellable: true
    },
    config
  );
  return finalConfig
}
createMenu(menuConfig);

// better
const menuConfig = {
  title: "Order",
  buttonText: "Send",
  cancellable: true
};
function createMenu(config) {
  let finalConfig =
    {
      title: "Foo",
      body: "Bar",
      buttonText: "Baz",
      cancellable: true,
      ...config
    },
  );
  return finalConfig
}
createMenu(menuConfig)
```

### 不要使用 `flag` 作为函数参数

`flag` 告诉用户此函数执行多个操作。函数应该做一件事。如果函数根据布尔值遵循不同的代码路径，请将它们分开。

```javascript
// Bad
function createFile(name, flag) {
  if (flag) {
    fs.create(`./temp/${name}`)
  } else {
    fs.create(name)
  }
}

// Good
function createFile(name) {
  fs.create(name)
}
function createTempFile(name) {
  createFile(`./temp/${name}`)
}
```

### 避免副作用

避免常见的缺陷，如函数除了获取一个值并返回另一个或多个值之外还执行其他操作；共享没有任何结构的对象之间的状态，使用可由任何对象写入的可变数据类型，以及不集中副作用发生的位置

```javascript
// Bad
let name = 'Ryan McDermott'
function splitIntoFirstAndLastName() {
  name = name.split(' ')
}
splitIntoFirstAndLastName()
console.log(name) // ['Ryan', 'McDermott'];

// Good
function splitIntoFirstAndLastName(name) {
  return name.split(' ')
}
const name = 'Ryan McDermott'
const newName = splitIntoFirstAndLastName(name)
console.log(name) // 'Ryan McDermott';
console.log(newName) // ['Ryan', 'McDermott'];
```

```javascript
// Bad
const addItemToCart = (cart, item) => {
  cart.push({ item, date: Date.now() })
}

// Good
const addItemToCart = (cart, item) => {
  return [...cart, { item, date: Date.now() }]
}
```

### 不要写全局变量

```javascript
// Bad
Array.prototype.diff = function diff(comparisonArray) {
  const hash = new Set(comparisonArray)
  return this.filter((elem) => !hash.has(elem))
}

// Good
class SuperArray extends Array {
  diff(comparisonArray) {
    const hash = new Set(comparisonArray)
    return this.filter((elem) => !hash.has(elem))
  }
}
```

### 封装条件

```javascript
// Bad
if (fsm.state === 'fetching' && isEmpty(listNode)) {
  // ...
}

// Good
function shouldShowSpinner(fsm, listNode) {
  return fsm.state === 'fetching' && isEmpty(listNode)
}
if (shouldShowSpinner(fsmInstance, listNodeInstance)) {
  // ...
}
```

### 避免使用否定句

```javascript
// Bad
function isDOMNodeNotPresent(node) {
  // ...
}
if (!isDOMNodeNotPresent(node)) {
  // ...
}

// Good
function isDOMNodePresent(node) {
  // ...
}
if (isDOMNodePresent(node)) {
  // ...
}
```

### 尽量避免条件句

充分利用多态

```javascript
// Bad
class Airplane {
  // ...
  getCruisingAltitude() {
    switch (this.type) {
      case '777':
        return this.getMaxAltitude() - this.getPassengerCount()
      case 'Air Force One':
        return this.getMaxAltitude()
      case 'Cessna':
        return this.getMaxAltitude() - this.getFuelExpenditure()
    }
  }
}

// Good
class Airplane {
  // ...
}
class Boeing777 extends Airplane {
  // ...
  getCruisingAltitude() {
    return this.getMaxAltitude() - this.getPassengerCount()
  }
}
class AirForceOne extends Airplane {
  // ...
  getCruisingAltitude() {
    return this.getMaxAltitude()
  }
}
class Cessna extends Airplane {
  // ...
  getCruisingAltitude() {
    return this.getMaxAltitude() - this.getFuelExpenditure()
  }
}
```

### 避免类型检查

使用`TS`

```javascript
// Bad
function combine(val1, val2) {
  if (
    (typeof val1 === 'number' && typeof val2 === 'number') ||
    (typeof val1 === 'string' && typeof val2 === 'string')
  ) {
    return val1 + val2
  }
  throw new Error('Must be of type String or Number')
}

// Good
function combine(val1: number | string, val2: number | string) {
  return val1 + val2
}
```

统一`API`

```javascript
// Bad
function travelToTexas(vehicle) {
  if (vehicle instanceof Bicycle) {
    vehicle.pedal(this.currentLocation, new Location('texas'))
  } else if (vehicle instanceof Car) {
    vehicle.drive(this.currentLocation, new Location('texas'))
  }
}

// Good
function travelToTexas(vehicle) {
  vehicle.move(this.currentLocation, new Location('texas'))
}
```

## `Object`和数据结构

### 使用 `getters` 和 `setters`

```javascript
// Bad
function makeBankAccount() {
  // ...
  return {
    balance: 0,
    // ...
  }
}
const account = makeBankAccount()
account.balance = 100

// Good
function makeBankAccount() {
  let balance = 0
  function getBalance() {
    return balance
  }
  function setBalance(amount) {
    balance = amount
  }
  return {
    // ...
    getBalance,
    setBalance,
  }
}
const account = makeBankAccount()
account.setBalance(100)
```

### 使用`private`属性

`ES5`及以下可以通过闭包实现

```javascript
// Bad
const Employee = function (name) {
  this.name = name
}
Employee.prototype.getName = function getName() {
  return this.name
}
const employee = new Employee('John Doe')
console.log(`Employee name: ${employee.getName()}`) // Employee name: John Doe
delete employee.name
console.log(`Employee name: ${employee.getName()}`) // Employee name: undefined

// Good
function makeEmployee(name) {
  return {
    getName() {
      return name
    },
  }
}
const employee = makeEmployee('John Doe')
console.log(`Employee name: ${employee.getName()}`) // Employee name: John Doe
delete employee.name
console.log(`Employee name: ${employee.getName()}`) // Employee name: John D
```

## `class（ES6）`

### 更可读的类继承、构造和方法定义

```javascript
// Bad
const Animal = function (age) {
  if (!(this instanceof Animal)) {
    throw new Error('Instantiate Animal with `new`')
  }
  this.age = age
}
Animal.prototype.move = function move() {}
const Mammal = function (age, furColor) {
  if (!(this instanceof Mammal)) {
    throw new Error('Instantiate Mammal with `new`')
  }
  Animal.call(this, age)
  this.furColor = furColor
}
Mammal.prototype = Object.create(Animal.prototype)
Mammal.prototype.constructor = Mammal
Mammal.prototype.liveBirth = function liveBirth() {}
const Human = function (age, furColor, languageSpoken) {
  if (!(this instanceof Human)) {
    throw new Error('Instantiate Human with `new`')
  }
  Mammal.call(this, age, furColor)
  this.languageSpoken = languageSpoken
}
Human.prototype = Object.create(Mammal.prototype)
Human.prototype.constructor = Human
Human.prototype.speak = function speak() {}

// Good
class Animal {
  constructor(age) {
    this.age = age
  }
  move() {
    /* ... */
  }
}
class Mammal extends Animal {
  constructor(age, furColor) {
    super(age)
    this.furColor = furColor
  }
  liveBirth() {
    /* ... */
  }
}
class Human extends Mammal {
  constructor(age, furColor, languageSpoken) {
    super(age, furColor)
    this.languageSpoken = languageSpoken
  }
  speak() {
    /* ... */
  }
}
```

### 使用链式

```javascript
// Bad
class Car {
  constructor(make, model, color) {
    this.make = make
    this.model = model
    this.color = color
  }
  setMake(make) {
    this.make = make
  }
  setModel(model) {
    this.model = model
  }
  setColor(color) {
    this.color = color
  }
  save() {
    console.log(this.make, this.model, this.color)
  }
}
const car = new Car('Ford', 'F-150', 'red')
car.setColor('pink')
car.save()

// Good
class Car {
  constructor(make, model, color) {
    this.make = make
    this.model = model
    this.color = color
  }
  setMake(make) {
    this.make = make
    return this
  }
  setModel(model) {
    this.model = model
    return this
  }
  setColor(color) {
    this.color = color
    return this
  }
  save() {
    console.log(this.make, this.model, this.color)
    return this
  }
}
const car = new Car('Ford', 'F-150', 'red').setColor('pink').save()
```

### 使用复合而非继承

```javascript
// Bad
class Employee {
  constructor(name, email) {
    this.name = name
    this.email = email
  }
  // ...
}
class EmployeeTaxData extends Employee {
  constructor(ssn, salary) {
    super()
    this.ssn = ssn
    this.salary = salary
  }
  // ...
}

// Good
class EmployeeTaxData {
  constructor(ssn, salary) {
    this.ssn = ssn
    this.salary = salary
  }
  // ...
}
class Employee {
  constructor(name, email) {
    this.name = name
    this.email = email
  }
  setTaxData(ssn, salary) {
    this.taxData = new EmployeeTaxData(ssn, salary)
  }
  // ...
}
```

## `SOLID`

### 单一职责原则`（SRP）`

```javascript
// Bad
class UserSettings {
  constructor(user) {
    this.user = user
  }
  changeSettings(settings) {
    if (this.verifyCredentials()) {
      // ...
    }
  }
  verifyCredentials() {
    // ...
  }
}
// Good
class UserAuth {
  constructor(user) {
    this.user = user
  }
  verifyCredentials() {
    // ...
  }
}
class UserSettings {
  constructor(user) {
    this.user = user
    this.auth = new UserAuth(user)
  }
  changeSettings(settings) {
    if (this.auth.verifyCredentials()) {
      // ...
    }
  }
}
```

### 开闭原则`（OCP）`

类、模块、功能等应该对扩展开放，但对修改关闭。

```javascript
// Bad
class AjaxAdapter extends Adapter {
  constructor() {
    super()
    this.name = 'ajaxAdapter'
  }
}
class NodeAdapter extends Adapter {
  constructor() {
    super()
    this.name = 'nodeAdapter'
  }
}
class HttpRequester {
  constructor(adapter) {
    this.adapter = adapter
  }
  fetch(url) {
    if (this.adapter.name === 'ajaxAdapter') {
      return makeAjaxCall(url).then((response) => {
        // transform response and return
      })
    } else if (this.adapter.name === 'nodeAdapter') {
      return makeHttpCall(url).then((response) => {
        // transform response and return
      })
    }
  }
}
function makeAjaxCall(url) {
  // request and return promise
}
function makeHttpCall(url) {
  // request and return promise
}

// Good
class AjaxAdapter extends Adapter {
  constructor() {
    super()
    this.name = 'ajaxAdapter'
  }
  request(url) {
    // ...
  }
}
class NodeAdapter extends Adapter {
  constructor() {
    super()
    this.name = 'nodeAdapter'
  }
  request(url) {
    // ...
  }
}
class HttpRequester {
  constructor(adapter) {
    this.adapter = adapter
  }
  fetch(url) {
    return this.adapter.request(url).then((response) => {
      // ...
    })
  }
}
```

### 里式替换原则`（LSP）`

继承必须确保父类所拥有的性质在子类中仍然成立——当一个子类的实例应该能够替换任何其父类的实例时，它们之间才具有 is-A 关系。

```javascript
// Bad
class Rectangle {
  constructor() {
    this.width = 0
    this.height = 0
  }
  setColor(color) {
    // ...
  }
  render(area) {
    // ...
  }
  setWidth(width) {
    this.width = width
  }
  setHeight(height) {
    this.height = height
  }
  getArea() {
    return this.width * this.height
  }
}
class Square extends Rectangle {
  setWidth(width) {
    this.width = width
    this.height = width
  }
  setHeight(height) {
    this.width = height
    this.height = height
  }
}
function renderLargeRectangles(rectangles) {
  rectangles.forEach((rectangle) => {
    rectangle.setWidth(4)
    rectangle.setHeight(5)
    const area = rectangle.getArea()
    rectangle.render(area)
  })
}
const rectangles = [new Rectangle(), new Rectangle(), new Square()]
renderLargeRectangles(rectangles)

// Good
class Shape {
  setColor(color) {
    // ...
  }
  render(area) {
    // ...
  }
}
class Rectangle extends Shape {
  constructor(width, height) {
    super()
    this.width = width
    this.height = height
  }
  getArea() {
    return this.width * this.height
  }
}
class Square extends Shape {
  constructor(length) {
    super()
    this.length = length
  }
  getArea() {
    return this.length * this.length
  }
}
function renderLargeShapes(shapes) {
  shapes.forEach((shape) => {
    const area = shape.getArea()
    shape.render(area)
  })
}
const shapes = [new Rectangle(4, 5), new Rectangle(4, 5), new Square(5)]
renderLargeRectangles(shapes)
```

### 接口隔离原则`（ISP）`

```javascript
// Bad
class DOMTraverser {
  constructor(settings) {
    this.settings = settings
    this.setup()
  }
  setup() {
    this.rootNode = this.settings.rootNode
    this.settings.animationModule.setup()
  }
  traverse() {
    // ...
  }
}
const $ = new DOMTraverser({
  rootNode: document.getElementsByTagName('body'),
  animationModule() {},
  // ...
})

// Good
class DOMTraverser {
  constructor(settings) {
    this.settings = settings
    this.options = settings.options
    this.setup()
  }
  setup() {
    this.rootNode = this.settings.rootNode
    this.setupOptions()
  }
  setupOptions() {
    if (this.options.animationModule) {
      // ...
    }
  }
  traverse() {
    // ...
  }
}
const $ = new DOMTraverser({
  rootNode: document.getElementsByTagName('body'),
  options: {
    animationModule() {},
  },
})
```

### 依赖倒置原则`（DIP）`

依赖抽象

```javascript
// Bad
class InventoryRequester {
  constructor() {
    this.REQ_METHODS = ['HTTP']
  }
  requestItem(item) {
    // ...
  }
}
class InventoryTracker {
  constructor(items) {
    this.items = items
    this.requester = new InventoryRequester()
  }
  requestItems() {
    this.items.forEach((item) => {
      this.requester.requestItem(item)
    })
  }
}
const inventoryTracker = new InventoryTracker(['apples', 'bananas'])
inventoryTracker.requestItems()

// Good
class InventoryTracker {
  constructor(items, requester) {
    this.items = items
    this.requester = requester
  }
  requestItems() {
    this.items.forEach((item) => {
      this.requester.requestItem(item)
    })
  }
}
class InventoryRequesterV1 {
  constructor() {
    this.REQ_METHODS = ['HTTP']
  }
  requestItem(item) {
    // ...
  }
}
class InventoryRequesterV2 {
  constructor() {
    this.REQ_METHODS = ['WS']
  }
  requestItem(item) {
    // ...
  }
}
const inventoryTracker = new InventoryTracker(['apples', 'bananas'], new InventoryRequesterV2())
inventoryTracker.requestItems()
```

## 并发性

### 使用`Promise`替换`callback`

```javascript
// Bad
import { get } from 'request'
import { writeFile } from 'fs'
get('https://en.wikipedia.org/wiki/Robert_Cecil_Martin', (requestErr, response, body) => {
  if (requestErr) {
    console.error(requestErr)
  } else {
    writeFile('article.html', body, (writeErr) => {
      if (writeErr) {
        console.error(writeErr)
      } else {
        console.log('File written')
      }
    })
  }
})

// Good
import { get } from 'request-promise'
import { writeFile } from 'fs-extra'
get('https://en.wikipedia.org/wiki/Robert_Cecil_Martin')
  .then((body) => {
    return writeFile('article.html', body)
  })
  .then(() => {
    console.log('File written')
  })
  .catch((err) => {
    console.error(err)
  })
```

### 使用`Async/await`比`Promise`更干净

```javascript
// Bad
import { get } from 'request-promise'
import { writeFile } from 'fs-extra'
get('https://en.wikipedia.org/wiki/Robert_Cecil_Martin')
  .then((body) => {
    return writeFile('article.html', body)
  })
  .then(() => {
    console.log('File written')
  })
  .catch((err) => {
    console.error(err)
  })

// Good
import { get } from 'request-promise'
import { writeFile } from 'fs-extra'
async function getCleanCodeArticle() {
  try {
    const body = await get('https://en.wikipedia.org/wiki/Robert_Cecil_Martin')
    await writeFile('article.html', body)
    console.log('File written')
  } catch (err) {
    console.error(err)
  }
}
getCleanCodeArticle()
```

## 错误处理

### 捕捉`errors`

```javascript
// Bad
try {
  functionThatMightThrow()
} catch (error) {
  console.log(error)
}

// Good
try {
  functionThatMightThrow()
} catch (error) {
  console.error(error)
  notifyUserOfError(error)
  reportErrorToService(error)
}

// Good
getData()
  .then((data) => {
    functionThatMightThrow(data)
  })
  .catch((error) => {
    console.error(error)
    notifyUserOfError(error)
    reportErrorToService(error)
  })
```

## `Formatting`

### 使用一致的大小写

```javascript
const DAYS_IN_WEEK = 7
const DAYS_IN_MONTH = 30

const SONGS = ['Back In Black', 'Stairway to Heaven', 'Hey Jude']
const ARTISTS = ['ACDC', 'Led Zeppelin', 'The Beatles']

function eraseDatabase() {}
function restoreDatabase() {}

class Animal {}
class Alpaca {}
```

### 调用方和被调用方应该是关闭的

调用者在被调用者的上方，这样像阅读报纸一样顺畅。

```javascript
class PerformanceReview {
  constructor(employee) {
    this.employee = employee
  }
  perfReview() {
    this.getPeerReviews()
    this.getManagerReview()
    this.getSelfReview()
  }
  getPeerReviews() {
    const peers = this.lookupPeers()
    // ...
  }
  lookupPeers() {
    return db.lookup(this.employee, 'peers')
  }
  getManagerReview() {
    const manager = this.lookupManager()
  }
  lookupManager() {
    return db.lookup(this.employee, 'manager')
  }
  getSelfReview() {
    // ...
  }
}
const review = new PerformanceReview(employee)
review.perfReview()
```

## 参考

- [Airbnb JavaScript 编码规范(涵盖 ECMAScript 6+)](https://www.html.cn/archives/8345)
