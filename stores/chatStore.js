import { defineStore } from 'pinia';

// Определяем хранилище (store) для управления состоянием чата
export const useChatStore = defineStore('chat', {
  state: () => ({
    // Список пользователей, участвующих в чате
    users: ['Alice', 'Bob', 'Charlie'],
    currentUser: null, // Текущий пользователь (нужно для идентификации)
    currentChat: null, // Для хранения текущего чата
    messages: {}, // Хранит сообщения между пользователями
  }),

  actions: {
    // Устанавливает текущего пользователя и сохраняет его в localStorage
    setCurrentUser(user) {
      this.currentUser = user;
      this.saveCurrentUser(); // Сохраняем текущего пользователя в localStorage
    },
    
    // Сохраняет текущего пользователя в localStorage
    saveCurrentUser() {
      if (process.client && localStorage) {
        localStorage.setItem('currentUser', this.currentUser);
      }
    },
    
    // Загружает текущего пользователя из localStorage
    loadCurrentUser() {
      if (process.client && localStorage) {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          this.currentUser = savedUser;
        }
      }
    },
    
    // Отправляет сообщение от текущего пользователя к выбранному пользователю
    sendMessage(receiver, message) {
      const timestamp = new Date().toLocaleTimeString(); // Получаем текущий временной штамп

      // Добавление сообщения для текущего пользователя
      this.addMessageToUser(this.currentUser, receiver, message, timestamp);

      // Добавление сообщения для получателя
      this.addMessageToUser(receiver, this.currentUser, message, timestamp);

      this.saveMessages(); // Сохраняем сообщения в localStorage
    },

    // Добавляет сообщение для указанного отправителя и получателя
    addMessageToUser(sender, receiver, message, timestamp) {
      if (!this.messages[sender]) {
        this.messages[sender] = {}; // Создаем объект для отправителя, если его нет
      }
      if (!this.messages[sender][receiver]) {
        this.messages[sender][receiver] = []; // Создаем массив сообщений для получателя, если его нет
      }
      // Сохраняем сообщение в формате объекта
      this.messages[sender][receiver].push({
        sender: this.currentUser, // Указываем отправителя
        message,
        timestamp
      });
    },

    // Получает сообщения для выбранного пользователя
    getMessages(user) {
      return this.messages[this.currentUser]?.[user] || []; // Возвращает сообщения или пустой массив, если их нет
    },

    // Сохраняет все сообщения в localStorage
    saveMessages() {
      if (process.client && localStorage) {
        localStorage.setItem('messages', JSON.stringify(this.messages)); // Сериализуем сообщения в строку
      }
    },

    // Загружает сообщения из localStorage
    loadMessages() {
      if (process.client && localStorage) {
        const savedMessages = localStorage.getItem('messages');
        if (savedMessages) {
          this.messages = JSON.parse(savedMessages); // Десериализуем и присваиваем сообщения
        }
      }
    }
  },

  // Подписываемся на изменения в localStorage для синхронизации
  subscribe: {
    handler(store) {
      if (process.client) {
        window.addEventListener('storage', (event) => {
          if (event.key === 'messages') {
            store.loadMessages(); // Загружаем новые сообщения из другой вкладки
          }
        });
      }
    },
  },
});

// Загружаем текущего пользователя и сообщения при монтировании компонента
export function useChatStoreWithLoad() {
  const store = useChatStore();
  onMounted(() => {
    store.loadCurrentUser(); // Загружаем текущего пользователя
    store.loadMessages(); // Загружаем сообщения
  });
  return store;
}
