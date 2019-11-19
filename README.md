# Тестовое Макаров Руслан

## Пример использования: 
```javascript
import CrmApi from '...';

const api = new CrmApi(process.env.login, process.env.hash, process.env.url);
(async () => {
    await api.connect(); 
    // await api.addTask(obj);
    await api.updateTask({
        id: 1348659,
        text: "Аллвфывфывфывы123аыаыа",
        updated_at: 1574163562705
    });
})();
```