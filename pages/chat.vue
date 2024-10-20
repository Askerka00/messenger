<template>
  <div class="flex h-screen">
    <aside class="w-1/4 bg-gray-200 p-4">
      <div class="flex justify-between">
        <h2 class="text-xl mb-4">Чаты</h2>
        <h2 class="text-xl mb-4">{{ currentUser }}</h2> <!-- Отображаем текущего пользователя -->
      </div>
      <!-- Список других пользователей, с которыми можно вести чат -->
      <div v-for="user in otherUsers" :key="user" class="mb-4">
        <button
          :class="{
            'block w-full text-left px-4 py-2 rounded shadow': true,
            'bg-green-200': user === selectedChat, // Выделение активного чата
            'bg-white': user !== selectedChat // Стандартный фон для неактивного чата
          }"
          @click="selectChat(user)" 
        >
          {{ user }} <!-- Имя пользователя -->
        </button>
      </div>
    </aside>
    <main class="w-3/4 p-4 h-screen">
      <div ref="messagesContainer" class='relative h-full flex flex-col'>
        <h2 class="text-2xl mb-4" v-if='!selectedChat'>Выберите чат</h2> <!-- Сообщение, если чат не выбран -->
        <h2 class="text-2xl mb-4" v-else>Чат с {{ selectedChat }}</h2> <!-- Название выбранного чата -->
        <div class="overflow-auto flex-grow mb-4">
          <!-- Вывод сообщений для выбранного чата -->
          <div
            v-for="msg in chatMessages"
            :key="msg.timestamp" 
            class="mb-2 p-2 rounded"
            :class="{
              'bg-blue-100 text-right': msg.sender === currentUser, // Стиль для отправленных сообщений
              'bg-gray-100 text-left': msg.sender !== currentUser // Стиль для полученных сообщений
            }"
          >
            <p>
              <strong>{{ msg.sender }}:</strong> {{ msg.message }}
            </p>
            <small>{{ msg.timestamp }}</small> 
          </div>
        </div>
        <div v-if="selectedChat" class="flex">
          <input
            v-model="newMessage" 
            placeholder="Введите сообщение..." 
            class="flex-grow border rounded px-4 py-2"
            @keyup.enter="sendMessage" 
          />
          <button
            class="ml-2 px-4 py-2 bg-green-500 text-white rounded"
            @click="sendMessage" 
            :disabled="!newMessage.trim()"
          >
            Отправить
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useChatStoreWithLoad } from "@/stores/chatStore"; // Импортируем хранилище чата

const chatStore = useChatStoreWithLoad(); // Получаем хранилище
const currentUser = computed(() => chatStore.currentUser); // Получаем текущего пользователя
const otherUsers = computed(() => // Получаем остальных пользователей
  chatStore.users.filter((user) => user !== chatStore.currentUser)
);
const selectedChat = ref(null); // Хранит выбранный чат
const newMessage = ref(""); // Хранит новое сообщение

// Получаем сообщения для выбранного собеседника
const chatMessages = computed(() => chatStore.getMessages(selectedChat.value));

// Контейнер для прокрутки сообщений
const messagesContainer = ref(null);

// Прокрутка чата до последнего сообщения
const scrollToBottom = () => {
  nextTick(() => { // Используем nextTick для того, чтобы дождаться обновления DOM
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight; // Прокручиваем вниз
    }
  });
};

// Прокручиваем чат при каждом изменении сообщений
watch(chatMessages, scrollToBottom); // Наблюдаем за изменениями chatMessages

// Выбор чата с пользователем
const selectChat = (user) => {
  if (selectedChat.value !== user) {
    selectedChat.value = user; // Устанавливаем выбранный чат
  }
};

// Отправка сообщения
const sendMessage = () => {
  if (newMessage.value.trim() && selectedChat.value) { // Проверяем, что сообщение не пустое и чат выбран
    chatStore.sendMessage(selectedChat.value, newMessage.value); // Отправляем сообщение
    newMessage.value = ""; // Очищаем поле ввода
  }
};

// Слушаем изменения в localStorage для синхронизации сообщений
const handleStorageEvent = (event) => {
  if (event.key === 'messages') {
    chatStore.loadMessages(); // Загружаем сообщения из localStorage при изменении
  }
};

// Подписываемся на событие storage при монтировании компонента
onMounted(() => {
  window.addEventListener('storage', handleStorageEvent);
});

// Отписываемся от события при размонтировании компонента
onBeforeUnmount(() => {
  window.removeEventListener('storage', handleStorageEvent);
});
</script>
