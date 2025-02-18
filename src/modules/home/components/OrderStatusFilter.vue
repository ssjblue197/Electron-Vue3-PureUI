<template>
  <div class="contents md:hidden">
    <p-button-group>
      <p-button
        v-for="(s, idx) in STATUS_LIST?.slice(0, 3)"
        :key="idx"
        @click="$emit('update:active', s.value)"
      >
        <span
          v-if="props.active == s.value"
          class="absolute h-2 w-2 translate-y-[-15%] rounded-full bg-[#17B26A]"
          slot="prefix"
        >
        </span>
        {{ s?.title }}
        <span v-if="!props.loading">
          (<p-format-number
            :value="
              Number(props.data?.[String(s.value)]) || 0
            "
          ></p-format-number
          >)
        </span>
        <p-spinner
          v-else
          class="relative translate-y-[25%]"
        ></p-spinner>
      </p-button>
      <p-dropdown hoist>
        <p-button slot="trigger" caret> More </p-button>
        <p-menu>
          <p-menu-item
            v-for="(s, idx) in STATUS_LIST?.slice(3)"
            :key="idx"
            @click="$emit('update:active', s.value)"
          >
            <span
              v-if="props.active == s.value"
              class="absolute left-3 h-2 w-2 translate-y-[-15%] rounded-full bg-[#17B26A]"
              slot="prefix"
            >
            </span>
            {{ s?.title }}
            <span v-if="!props.loading">
              (<p-format-number
                :value="
                  Number(props.data?.[String(s.value)]) || 0
                "
              ></p-format-number
              >)
            </span>
            <p-spinner
              v-else
              class="relative translate-y-[25%]"
            ></p-spinner>
          </p-menu-item>
        </p-menu>
      </p-dropdown>
    </p-button-group>
  </div>
  <div class="hidden md:contents">
    <p-button-group>
      <p-button
        v-for="(s, idx) in STATUS_LIST"
        :key="idx"
        @click="$emit('update:active', s.value)"
      >
        <span
          v-if="props.active == s.value"
          class="absolute h-2 w-2 translate-y-[-15%] rounded-full bg-[#17B26A]"
          slot="prefix"
        >
        </span>
        {{ s?.title }}
        <span v-if="!props.loading">
          (<p-format-number
            :value="
              Number(props.data?.[String(s.value)]) || 0
            "
          ></p-format-number
          >)
        </span>
        <p-spinner
          v-else
          class="relative translate-y-[25%]"
        ></p-spinner>
      </p-button>
    </p-button-group>
  </div>
</template>

<script setup lang="ts">
import { STATUS_LIST } from '@/modules/home/constant';
import { Filter } from '@/modules/home/types';

interface Props {
  data?: Record<string, number>;
  loading?: boolean;
  active?: string;
  filters?: Filter;
}

const props = withDefaults(defineProps<Props>(), {
  data: undefined,
  loading: false,
  active: '',
  filters: undefined,
});
</script>

<style scoped></style>
