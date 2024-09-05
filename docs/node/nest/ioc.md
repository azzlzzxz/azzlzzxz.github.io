# IOC

## :pencil2: IOC 解决了什么问题

后端系统里有很多对象：

1. `Controller 对象：`接收 `http` 请求，调用`Service`，返回响应。
2. `Service 对象：`实现业务逻辑。
3. `Repository 对象：`实现对数据库的增删改查。
4. `DataSource 对象：`数据库链接对象。
5. `Config 对象：`配置对象。

这些对象错综复杂 💢：

`Controller` 依赖了 `Service` 实现业务逻辑，`Service` 依赖了 `Repository` 来做增删改查，`Repository` 依赖 `DataSource` 来建立连接，`DataSource` 又需要从 `Config` 对象拿到用户名密码等信息。

这就导致了创建这些对象是很复杂的，你要理清它们之间的依赖关系，哪个先创建哪个后创建。

```js
const config = new Config({ username: 'xxx', password: 'xxx' })

const dataSource = new DataSource(config)

const repository = new Repository(dataSource)

const service = new Service(repository)

const controller = new Controller(service)
```

要经过一系列的初始化之后才可以使用 `Controller` 对象。

而且像 `config`、`dataSource`、`repository`、`service`、`controller` 等这些对象不需要每次都 `new` 一个新的，一直用一个就可以，也就是保持单例。

在应用初始化的时候，需要理清依赖的先后关系，创建一大堆对象组合起来，还要保证不要多次 `new`，这就很麻烦？

💡 `IOC` 就是解决这系列的问题的。

## 那、什么是 `IOC` 🤔

**<font color="FF9D00">在 `Nest` 中，`IOC（Inversion of Control，控制反转）`是一种设计模式，它用于管理和解决类之间的依赖关系。</font>**

**<font color="FF9D00">`Nest` 使用依赖注入`（DI）`作为实现 `IOC` 的机制。依赖注入是一种设计模式，它允许将依赖项动态地注入到一个类中，而不是在类内部直接创建这些依赖项的实例。这样做的好处是可以实现松耦合的代码，提高可测试性和可维护性。</font>**

## 理解 `IOC`

💭 `IOC` 实现思路：我在 `class` 上声明依赖了啥，工具去分析我声明的依赖关系，根据先后顺序把对象创建好，再组装起来。

:::tip
在 `Nest` 中，`IOC` 和依赖注入的核心概念是：

1. `Provider（提供者）：` `Provider` 是一个可被注入的类，它负责创建和管理特定类型的实例。在 `Nest` 中，常见的 `Provider` 类型包括服务类、仓储类、工厂类等。

2. `Module（模块）：` `Module` 是一个逻辑单元，它用于组织和配置应用程序中的提供者。每个 `Nest` 应用程序都由多个模块组成。模块通过 `@Module` 装饰器来定义，并在 `imports` 属性中指定依赖的其他模块。

3. `Dependency Injection Container（依赖注入容器）：` `Nest` 中的依赖注入容器负责管理和解决 `Provider` 之间的依赖关系。容器在应用程序启动时会扫描模块的依赖关系，并根据需要创建和注入 `Provider` 的实例。

:::

在使用 `IOC` 和依赖注入时，您可以通过在类的构造函数参数上使用 `@Inject()` 装饰器来声明依赖项。Nest 将根据这些声明来解析依赖关系，并在需要时提供依赖项的实例。

通过使用 `IOC` 和依赖注入，您可以轻松管理和组织复杂的应用程序结构，实现可扩展和可测试的代码。它还促进了模块化和松耦合的设计，使得代码更加清晰和可维护。

## `@Injectable`

在 `Nest` 中，`@Injectable` 装饰器用于将类标记为可注入的依赖项。它是 `Nest` 中依赖注入系统的核心部分之一。

当您在类上应用 `@Injectable` 装饰器时，`Nest` 将能够根据需要创建类的实例，并将其注入到其他类中。这使得在 `Nest` 应用程序中使用依赖注入变得非常方便。

:::tip `@Injectable` 装饰器主要用于以下目的：

1. 依赖注入：通过在类的构造函数参数上使用 `@Injectable` 装饰器，您可以告诉 `Nest` 该类需要哪些依赖项。在需要创建类的实例时，`Nest` 会自动解析并提供这些依赖项。

2. 单例模式：默认情况下，使用 `@Injectable` 装饰器标记的类在整个应用程序中是单例的。这意味着每次请求都将获得相同的实例。`Nest` 会负责创建并管理这些实例，以确保它们在需要时正确地共享。

3. 循环依赖解析：`Nest` 支持解析循环依赖关系。当出现类之间的循环依赖时，您可以使用 `@Injectable` 装饰器来解决问题。`Nest` 将根据需要创建类的代理对象，以避免循环依赖引发的问题。

:::

总之，`@Injectable` 装饰器在 `Nest` 中是非常重要的，它允许您使用依赖注入来创建可维护和可扩展的应用程序。通过使用该装饰器，您可以轻松地管理类之间的依赖关系，并实现松耦合的代码架构

为什么 `Controller` 是单独的装饰器呢？

因为 `Service` 是可以被注入也是可以注入到别的对象的，所以用 `@Injectable` 声明。

而 `Controller` 只需要被注入，所以 `nest` 单独给它加了 `@Controller` 的装饰器。

## 总之

1. 后端系统有很多的对象，这些对象之间的关系错综复杂，如果手动创建并组装对象比较麻烦，所以后端框架一般都提供了 `IOC` 机制。

2. `IOC` 机制是在 `class` 上标识哪些是可以被注入的，它的依赖是什么，然后从入口开始扫描这些对象和依赖，自动创建和组装对象。

3. `Nest` 里通过 `@Controller` 声明可以被注入的 `controller`，通过 `@Injectable` 声明可以被注入也可以注入别的对象的 `provider`，然后在 `@Module` 声明的模块里引入。

4. 并且 `Nest` 还提供了 `Module` 和 `Module` 之间的 `import`，可以引入别的模块的 `provider` 来注入。
