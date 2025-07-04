<template>
  <div class="main-container">
    <div class="editor-container editor-container_classic-editor" ref="editorContainerElement">
      <div class="editor-container__editor">
        <div ref="editorElement">
          <ckeditor v-if="isLayoutReady" v-model="editorData" :editor="editor" :config="config" />
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import { computed, ref, onMounted, watchEffect, watch } from 'vue'
import { Ckeditor } from '@ckeditor/ckeditor5-vue'

import {
  ClassicEditor,
  Autoformat,
  AutoImage,
  Autosave,
  BlockQuote,
  Bold,
  CKBox,
  CKBoxImageEdit,
  CloudServices,
  Emoji,
  Essentials,
  Heading,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  MediaEmbed,
  Mention,
  Paragraph,
  PasteFromOffice,
  PictureEditing,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
} from 'ckeditor5'

import 'ckeditor5/ckeditor5.css'

//const LICENSE_KEY ='eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3ODI2OTExOTksImp0aSI6IjAwMTg4YTliLTI2YWEtNGY0MC1hNDI2LTVhZDA5ZDlmN2NiNyIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiXSwiZmVhdHVyZXMiOlsiRFJVUCIsIkUyUCIsIkUyVyJdLCJ2YyI6IjVjNjNmOWRhIn0.G80nCftuBhwIkr5WPEs3M1VUrSiSUt1Jnt6FLV_aVfI6Dx_LjddM-D_3BtVCVEmRriWWzInLm7s9rhbbb8-aOA'
const LICENSE_KEY ='eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NTIzNjQ3OTksImp0aSI6IjI0NTk4ZTkyLWEzOTItNGM4NS05OWYxLTZkNmQyYjlhMzM3ZSIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjJmZDQ4N2RlIn0.os5k18-10KlvKQtMeQMvDS55doeutwouHQpSXdK4jCLvvPxzhRbGYNiIfzYLnj4DuDNXMV_Wt4PZMMGshbq7qg'
const CLOUD_SERVICES_TOKEN_URL =
  'https://lu0qsin9o3z4.cke-cs.com/token/dev/47cf623030a5f2ab56c6b380862d079e61ed20450c2e065b2c15ee4de919?limit=10'

const props = defineProps(['modelValue'])
const emits = defineEmits(['update:modelValue'])

const editorContainerElement = ref(null)

const isLayoutReady = ref(false)
const editor = ClassicEditor
const editorData = ref(props.modelValue || '')

const config = computed(() => {
  if (!isLayoutReady.value) {
    return null
  }

  return {
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'underline',
        '|',
        'emoji',
        'link',
        'insertImage',
        'ckbox',
        'mediaEmbed',
        'insertTable',
        'blockQuote',
        '|',
        'bulletedList',
        'numberedList',
        'todoList',
        'outdent',
        'indent',
      ],
      shouldNotGroupWhenFull: false,
    },
    plugins: [
      Autoformat,
      AutoImage,
      Autosave,
      BlockQuote,
      Bold,
      CKBox,
      CKBoxImageEdit,
      CloudServices,
      Emoji,
      Essentials,
      Heading,
      ImageBlock,
      ImageCaption,
      ImageInline,
      ImageInsert,
      ImageInsertViaUrl,
      ImageResize,
      ImageStyle,
      ImageTextAlternative,
      ImageToolbar,
      ImageUpload,
      Indent,
      IndentBlock,
      Italic,
      Link,
      LinkImage,
      List,
      ListProperties,
      MediaEmbed,
      Mention,
      Paragraph,
      PasteFromOffice,
      PictureEditing,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      TextTransformation,
      TodoList,
      Underline,
    ],
    cloudServices: {
      tokenUrl: CLOUD_SERVICES_TOKEN_URL,
    },
    heading: {
      options: [
        {
          model: 'paragraph',
          title: 'Paragraph',
          class: 'ck-heading_paragraph',
        },
        {
          model: 'heading1',
          view: 'h1',
          title: 'Heading 1',
          class: 'ck-heading_heading1',
        },
        {
          model: 'heading2',
          view: 'h2',
          title: 'Heading 2',
          class: 'ck-heading_heading2',
        },
        {
          model: 'heading3',
          view: 'h3',
          title: 'Heading 3',
          class: 'ck-heading_heading3',
        },
        {
          model: 'heading4',
          view: 'h4',
          title: 'Heading 4',
          class: 'ck-heading_heading4',
        },
        {
          model: 'heading5',
          view: 'h5',
          title: 'Heading 5',
          class: 'ck-heading_heading5',
        },
        {
          model: 'heading6',
          view: 'h6',
          title: 'Heading 6',
          class: 'ck-heading_heading6',
        },
      ],
    },
    image: {
      toolbar: [
        'toggleImageCaption',
        'imageTextAlternative',
        '|',
        'imageStyle:inline',
        'imageStyle:wrapText',
        'imageStyle:breakText',
        '|',
        'resizeImage',
        '|',
        'ckboxImageEdit',
      ],
    },
    initialData: props.modelValue || '',
    licenseKey: LICENSE_KEY,
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: 'https://',
      decorators: {
        toggleDownloadable: {
          mode: 'manual',
          label: 'Downloadable',
          attributes: {
            download: 'file',
          },
        },
      },
    },
    list: {
      properties: {
        styles: true,
        startIndex: true,
        reversed: true,
      },
    },
    mention: {
      feeds: [
        {
          marker: '@',
          feed: [
            /* See: https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html */
          ],
        },
      ],
    },
    placeholder: 'Type or paste your content here!',
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells',
        'tableProperties',
        'tableCellProperties',
      ],
    },
  }
})

onMounted(() => {
  isLayoutReady.value = true
})

watchEffect(() => {
  if (config.value) {
    configUpdateAlert(config.value)
  }
})

/**
 * This function exists to remind you to update the config needed for premium features.
 * The function can be safely removed. Make sure to also remove call to this function when doing so.
 */
function configUpdateAlert(config) {
  if (configUpdateAlert.configUpdateAlertShown) {
    return
  }

  const isModifiedByUser = (currentValue, forbiddenValue) => {
    if (currentValue === forbiddenValue) {
      return false
    }

    if (currentValue === undefined) {
      return false
    }

    return true
  }

  const valuesToUpdate = []

  configUpdateAlert.configUpdateAlertShown = true

  if (!isModifiedByUser(config.cloudServices?.tokenUrl, '<YOUR_CLOUD_SERVICES_TOKEN_URL>')) {
    valuesToUpdate.push('CLOUD_SERVICES_TOKEN_URL')
  }

  if (valuesToUpdate.length) {
    window.alert(
      [
        'Please update the following values in your editor config',
        'to receive full access to Premium Features:',
        '',
        ...valuesToUpdate.map((value) => ` - ${value}`),
      ].join('\n')
    )
  }
}

watch(
  () => props.modelValue,
  (newValue) => {
    editorData.value = newValue
  }
)

watch(editorData, (newValue) => {
  emits('update:modelValue', newValue)
})
</script>
  
  <style>
@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400;1,700&display=swap');

@media print {
  body {
    margin: 0 !important;
  }
}

.main-container {
  font-family: 'Lato';
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.ck-content {
  font-family: 'Lato';
  line-height: 1.6;
  word-break: break-word;
}

.editor-container_classic-editor .editor-container__editor {
  min-width: 795px;
  max-width: 100%;
}
</style>