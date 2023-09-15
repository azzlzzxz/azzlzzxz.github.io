# 接口

## 描述对象的形状

```typescript
interface Speakable {
  name: string
  speak(): void
}

let speakMan: Speakable = {
  name: 'czp',
  speak() {},
}
```
