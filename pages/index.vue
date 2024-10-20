<template>
  <div class="flex justify-center items-center h-screen w-full">
    <div class="flex relative bottom-16 flex-col items-center">
      <h1 class="text-4xl font-semibold">Добро пожаловать</h1> <!-- Заголовок приветствия -->
      <div class="w-72 mt-10 mb-8">
        <Listbox v-model="selectedPerson"> <!-- Компонент списка для выбора пользователя -->
          <div class="relative mt-1">
            <ListboxButton
              class="relative h-12 w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
            >
              <span class="block truncate">{{ selectedPerson }}</span> <!-- Отображение выбранного пользователя -->
              <span
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
              >
                <Icon
                  name="heroicons:arrows-up-down"
                  class="h-32 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </ListboxButton>

            <transition
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <ListboxOptions
                class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
              >
                <!-- Опции для выбора пользователя -->
                <ListboxOption
                  v-slot="{ active, selected }" 
                  v-for="person in people"
                  :key="person" 
                  :value="person" 
                  as="template"
                  class="cursor-pointer"
                >
                  <li
                    :class="[ // Применяем классы в зависимости от состояния
                      active ? 'bg-sky-100 text-sky-900' : 'text-gray-900',
                      'relative select-none py-2 pl-10 pr-4',
                    ]"
                  >
                    <span
                      :class="[selected ? 'font-medium text-sky-900' : 'font-normal', 'block truncate']"
                      >{{ person }}</span> 
                    <span
                      v-if="selected" 
                      class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                    >
                    </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
      </div>
      <!-- Убираем передачу переменной user, так как используем selectedPerson -->
        <button @click="selectUser(selectedPerson)" class="px-14 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600">
          Войти 
        </button>
    </div>
  </div>
</template>

<script setup>
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue';
import { useChatStore } from '@/stores/chatStore';

const chatStore = useChatStore(); // Получаем хранилище чата
const router = useRouter(); // Инициализируем router
const people = chatStore.users; // Получаем список пользователей из хранилища

// Функция для выбора пользователя и перехода на страницу чата
const selectUser = (user) => {
  chatStore.setCurrentUser(user); 
  router.push('/chat'); 
};

const selectedPerson = ref(people[0]); // Устанавливаем первого пользователя как выбранного по умолчанию
</script>
