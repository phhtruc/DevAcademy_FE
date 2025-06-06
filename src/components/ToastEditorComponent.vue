<template>
  <div>
    <div ref="editorRoot"></div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue'
import Editor from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const editor = ref(null)
const editorRoot = ref(null)
const isUpdating = ref(false)

const initEditor = () => {
  if (editor.value) return

  editor.value = new Editor({
    el: editorRoot.value,
    height: '400px',
    initialEditType: 'wysiwyg',
    previewStyle: 'vertical',
    initialValue: props.modelValue || '',
    language: 'vi',
    autofocus: false,
  })

  editor.value.on('change', () => {
    if (isUpdating.value) return

    const content = editor.value.getHTML()
    emit('update:modelValue', content)
  })
}

watch(
  () => props.modelValue,
  (newVal) => {
    if (!editor.value) return

    const currentContent = editor.value.getHTML()
    if (newVal !== currentContent) {
      isUpdating.value = true 
      nextTick(() => {
        try {
          editor.value.setHTML(newVal || '') 
        } catch (error) {
          console.error('Error updating editor content:', error)
        } finally {
          isUpdating.value = false 
        }
      })
    }
  },
  { immediate: true }
)

onMounted(() => {
  nextTick(() => {
    initEditor()
  })
})

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.off('change')
    editor.value.destroy()
  }
})
</script>