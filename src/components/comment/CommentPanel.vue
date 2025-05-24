<template>
  <div class="comment-panel" :class="{ 'comment-panel-open': isOpen }">
    <div class="comment-panel-header">
      <h4>Hỏi Đáp</h4>
      <button class="close-btn" @click="$emit('close')">
        <i class="fas fa-times"></i>
      </button>
    </div>

    <div class="comment-panel-content">
      <div class="comment-form mb-4">
        <div v-if="!editorVisible" class="placeholder-box" @click="editorVisible = true">
          <img src="https://www.gravatar.com/avatar/?d=mp" class="avatar" />
          <div class="fake-input">Nhập bình luận mới của bạn</div>
        </div>
        <div v-else class="d-flex align-items-start">
          <img src="https://www.gravatar.com/avatar/?d=mp" class="avatar" />
          <div class="editor-wrapper w-100">
            <div class="editor-toolbar">
              <button
                @click="editor.chain().focus().toggleBold().run()"
                :class="{ 'is-active': editor?.isActive('bold') }"
                title="Đậm (Ctrl+B)"
              >
                <i class="fas fa-bold"></i>
              </button>
              <button
                @click="editor.chain().focus().toggleItalic().run()"
                :class="{ 'is-active': editor?.isActive('italic') }"
                title="Nghiêng (Ctrl+I)"
              >
                <i class="fas fa-italic"></i>
              </button>
              <button
                @click="editor.chain().focus().toggleCodeBlock().run()"
                :class="{ 'is-active': editor?.isActive('codeBlock') }"
                title="Khối mã"
              >
                <i class="fas fa-code"></i>
              </button>
              <button
                @click="editor.chain().focus().toggleBulletList().run()"
                :class="{ 'is-active': editor?.isActive('bulletList') }"
                title="Danh sách"
              >
                <i class="fas fa-list-ul"></i>
              </button>
            </div>
            <editor-content :editor="editor" />
          </div>
        </div>

        <div v-if="editorVisible" class="d-flex justify-content-end mt-2">
          <button class="btn btn-light mt-2 mr-2" @click=";(editorVisible = false), clearEditor()">
            Huỷ
          </button>
          <button class="btn btn-primary mt-2" @click="postComment" :disabled="isEditorEmpty">
            Gửi câu hỏi
          </button>
        </div>
      </div>
      <span class="font-weight-bold h5">{{ totalCommentsCount }} bình luận</span>

      <div class="comment-list mt-2">
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div v-else-if="comments.length === 0" class="text-center py-4">
          <p class="text-muted">Chưa có câu hỏi nào. Hãy là người đầu tiên đặt câu hỏi!</p>
        </div>

        <div v-else class="comment-items">
          <div
            class="comment-item"
            :class="{ deleting: commentObj.comment.isDeleting }"
            v-for="commentObj in comments"
            :key="commentObj.comment.id"
          >
            <div class="comment-header d-flex align-items-center">
              <div class="avatar">
                <img
                  :src="commentObj.comment.userAvatar || 'https://www.gravatar.com/avatar/?d=mp'"
                  alt="User avatar"
                />
              </div>
              <div class="user-info ml-2">
                <h6 class="mb-0">{{ commentObj.comment.username }}</h6>
                <small class="text-muted">{{ formatDate(commentObj.comment.createdAt) }}</small>
              </div>
            </div>

            <div class="comment-body mt-2">
              <div v-html="commentObj.comment.content"></div>
            </div>

            <div class="comment-actions">
              <button class="btn btn-sm btn-link" @click="toggleReplyForm(commentObj.comment.id)">
                Trả lời
              </button>
              <button
                class="btn btn-sm btn-link"
                @click="likeComment(commentObj.comment.id)"
                :class="{ 'text-primary': commentObj.comment.isLikedByCurrentUser }"
              >
                <i class="fas fa-thumbs-up"></i> {{ commentObj.comment.likeCount || 0 }}
              </button>

              <template v-if="canDelete(commentObj.comment)">
                <button
                  v-if="!confirmingDelete.has(commentObj.comment.id)"
                  class="btn btn-sm btn-link text-danger"
                  @click="toggleDeleteConfirm($event, commentObj.comment.id)"
                  :disabled="commentObj.comment.isDeleting"
                >
                  <i class="fas fa-trash"></i>
                </button>
                <div v-else class="delete-confirm-buttons">
                  <button
                    class="btn btn-sm btn-danger"
                    @click="deleteComment($event, commentObj.comment.id)"
                  >
                    Xác nhận
                  </button>
                  <button
                    class="btn btn-sm btn-light ml-1"
                    @click="cancelDeleteConfirm($event, commentObj.comment.id)"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </template>
            </div>

            <div v-if="replyFormVisible[commentObj.comment.id]" class="reply-form mt-2">
              <div class="editor-wrapper w-100">
                <div class="editor-toolbar">
                  <button
                    @click="editorCommands(commentObj.comment.id, 'bold')"
                    :class="{ 'is-active': isEditorCommandActive(commentObj.comment.id, 'bold') }"
                    title="Đậm (Ctrl+B)"
                  >
                    <i class="fas fa-bold"></i>
                  </button>
                  <button
                    @click="editorCommands(commentObj.comment.id, 'italic')"
                    :class="{ 'is-active': isEditorCommandActive(commentObj.comment.id, 'italic') }"
                    title="Nghiêng (Ctrl+I)"
                  >
                    <i class="fas fa-italic"></i>
                  </button>
                  <button
                    @click="editorCommands(commentObj.comment.id, 'codeBlock')"
                    :class="{
                      'is-active': isEditorCommandActive(commentObj.comment.id, 'codeBlock'),
                    }"
                    title="Khối mã"
                  >
                    <i class="fas fa-code"></i>
                  </button>
                  <button
                    @click="editorCommands(commentObj.comment.id, 'bulletList')"
                    :class="{
                      'is-active': isEditorCommandActive(commentObj.comment.id, 'bulletList'),
                    }"
                    title="Danh sách"
                  >
                    <i class="fas fa-list-ul"></i>
                  </button>
                </div>
                <editor-content :editor="replyEditors[commentObj.comment.id]" />
              </div>

              <div class="d-flex mt-2">
                <button class="btn btn-sm btn-primary" @click="postReply(commentObj.comment.id)">
                  Trả lời
                </button>
                <button
                  class="btn btn-sm btn-light ml-2"
                  @click="toggleReplyForm(commentObj.comment.id)"
                >
                  Hủy
                </button>
              </div>
            </div>

            <!-- Replies -->
            <div
              v-if="commentObj.replies && commentObj.replies.length > 0"
              class="comment-replies mt-3"
            >
              <div
                class="reply-item"
                :class="{ deleting: reply.isDeleting }"
                v-for="reply in commentObj.replies"
                :key="reply.id"
              >
                <div class="comment-header d-flex align-items-center">
                  <div class="avatar avatar-sm">
                    <img
                      :src="reply.userAvatar || 'https://www.gravatar.com/avatar/?d=mp'"
                      alt="User avatar"
                    />
                  </div>
                  <div class="user-info ml-2">
                    <h6 class="mb-0 small">{{ reply.username }}</h6>
                    <small class="text-muted">{{ formatDate(reply.createdAt) }}</small>
                  </div>
                </div>

                <div class="comment-body mt-1">
                  <div v-html="reply.content" class="mb-1"></div>
                </div>

                <div class="comment-actions">
                  <button
                    class="btn btn-sm btn-link py-0"
                    @click="likeComment(reply.id)"
                    :class="{ 'text-primary': reply.isLikedByCurrentUser }"
                  >
                    <i class="fas fa-thumbs-up"></i> {{ reply.likeCount || 0 }}
                  </button>

                  <template v-if="canDelete(reply)">
                    <button
                      v-if="!confirmingDelete.has(reply.id)"
                      class="btn btn-sm btn-link py-0 text-danger"
                      @click="toggleDeleteConfirm($event, reply.id)"
                      :disabled="reply.isDeleting"
                    >
                      <i class="fas fa-trash"></i>
                    </button>

                    <div v-else class="delete-confirm-buttons">
                      <button
                        class="btn btn-sm btn-danger py-0"
                        style="font-size: 0.8rem"
                        @click="deleteComment($event, reply.id)"
                      >
                        Xác nhận
                      </button>
                      <button
                        class="btn btn-sm btn-light ml-1 py-0"
                        style="font-size: 0.8rem"
                        @click="cancelDeleteConfirm($event, reply.id)"
                      >
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { ref, onMounted, reactive, watch, onBeforeUnmount, shallowRef, computed } from 'vue'
import axios from '@/plugins/axios'
import { useAuthStore } from '@/stores/auth'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import webSocketService from '@/services/WebSocketService'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  lessonId: {
    type: Number,
    required: true,
  },
})

const rootAPI = import.meta.env.VITE_APP_ROOT_API
const emit = defineEmits(['close'])
const authStore = useAuthStore()

const comments = ref([])
const loading = ref(false)
const replyFormVisible = reactive({})
const editor = shallowRef(null)
const editorVisible = ref(false)
const replyEditors = reactive({})
const webSocketSubscription = ref(null)

const getUserId = () => {
  try {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const userData = JSON.parse(userStr)
      return userData.id
    }
  } catch (e) {
    console.error('Error parsing user data from localStorage:', e)
  }
  return null
}

const currentUserId = ref(getUserId())

const confirmingDelete = reactive(new Set())

const totalCommentsCount = computed(() => {
  let total = 0;
  
  if (!Array.isArray(comments.value)) {
    return total;
  }
  
  total += comments.value.length;
  
  for (const commentObj of comments.value) {
    if (Array.isArray(commentObj.replies)) {
      total += commentObj.replies.length;
    }
  }
  
  return total;
});

const fetchComments = async () => {
  //loading.value = true
  try {
    const response = await axios.get(`${rootAPI}/comments/lessons/${props.lessonId}`)
    comments.value = response.data.data
  } catch (error) {
    console.error('Error fetching comments:', error)
  } finally {
    loading.value = false
  }
}

const isEditorEmpty = computed(() => {
  if (!editor.value) return true
  return editor.value.isEmpty
})

const initEditor = () => {
  editor.value = new Editor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Nhập câu hỏi hoặc ý kiến của bạn...',
      }),
    ],
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
      },
    },
  })
}

const initReplyEditor = (commentId) => {
  if (replyEditors[commentId]) return

  replyEditors[commentId] = new Editor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Nhập câu trả lời của bạn...',
      }),
    ],
    editorProps: {
      attributes: {
        class: 'tiptap-editor reply-editor',
      },
    },
  })
}

const destroyReplyEditor = (commentId) => {
  if (replyEditors[commentId]) {
    replyEditors[commentId].destroy()
    delete replyEditors[commentId]
  }
}

const editorCommands = (commentId, command) => {
  if (!replyEditors[commentId]) return

  switch (command) {
    case 'bold':
      replyEditors[commentId].chain().focus().toggleBold().run()
      break
    case 'italic':
      replyEditors[commentId].chain().focus().toggleItalic().run()
      break
    case 'codeBlock':
      replyEditors[commentId].chain().focus().toggleCodeBlock().run()
      break
    case 'bulletList':
      replyEditors[commentId].chain().focus().toggleBulletList().run()
      break
    default:
      break
  }
}

const isEditorCommandActive = (commentId, command) => {
  if (!replyEditors[commentId]) return false

  return replyEditors[commentId].isActive(command)
}

const clearEditor = () => {
  if (editor.value) {
    editor.value.commands.clearContent()
  }
}

const postComment = async () => {
  if (!editor.value || editor.value.isEmpty) return

  const content = editor.value.getHTML()

  // Tạo comment tạm
  const tempComment = {
    id: `temp-${Date.now()}`,
    content: content,
    userId: getUserId(),
    username: authStore.user?.displayName || authStore.user?.username || 'Bạn',
    userAvatar: authStore.user?.avatar || authStore.user?.profileImage || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likeCount: 0,
    isLikedByCurrentUser: false,
  }

  comments.value.unshift({
    comment: tempComment,
    replies: [],
  })

  clearEditor()
  editorVisible.value = false

  // Cuộn lên đầu để xem comment mới
  const contentElement = document.querySelector('.comment-panel-content')
  if (contentElement) {
    contentElement.scrollTop = 0
  }

  try {
    await axios.post(`${rootAPI}/comments/lessons/${props.lessonId}`, {
      content: content,
    })

    clearEditor()
    editorVisible.value = false
    await fetchComments()
  } catch (error) {
    console.error('Error posting comment:', error)
  }
}

const toggleReplyForm = (commentId) => {
  if (replyFormVisible[commentId]) {
    replyFormVisible[commentId] = false
    destroyReplyEditor(commentId)
  } else {
    replyFormVisible[commentId] = true
    initReplyEditor(commentId)
  }
}

const postReply = async (commentId) => {
  if (!replyEditors[commentId] || replyEditors[commentId].isEmpty) return

  const content = replyEditors[commentId].getHTML()

  const parentIndex = comments.value.findIndex(
    (item) => item.comment && item.comment.id === commentId
  )
  if (parentIndex < 0) return

  const tempReply = {
    id: `temp-reply-${Date.now()}`,
    content: content,
    userId: getUserId(),
    username: authStore.user?.displayName || authStore.user?.username || 'Bạn',
    userAvatar: authStore.user?.avatar || authStore.user?.profileImage || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likeCount: 0,
    isLikedByCurrentUser: false,
    idOriginalComment: commentId,
  }

  const parentComment = comments.value[parentIndex]
  if (!parentComment.replies) {
    parentComment.replies = []
  }
  parentComment.replies.push(tempReply)

  // Đóng form và hủy editor
  replyFormVisible[commentId] = false
  destroyReplyEditor(commentId)

  // Lưu tham chiếu đến phần tử comment
  const commentElement = document.querySelector(`[data-comment-id="${commentId}"]`)

  // Đảm bảo comment vẫn nhìn thấy được sau khi thêm reply
  if (commentElement) {
    setTimeout(() => {
      commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  try {
    await axios.post(`${rootAPI}/comments/${commentId}/replies`, {
      content: content,
    })

    replyFormVisible[commentId] = false
    destroyReplyEditor(commentId)
    await fetchComments()
  } catch (error) {
    console.error('Error posting reply:', error)
  }
}

const likeComment = async (commentId) => {
  const comment = findComment(commentId)
  if (!comment) return

  try {
    if (comment.isLikedByCurrentUser) {
      await axios.delete(`${rootAPI}/comments/${commentId}/likes`)
    } else {
      await axios.post(`${rootAPI}/comments/${commentId}/likes`)
    }
  } catch (error) {
    console.error('Error toggling like:', error)
  }
}

const toggleDeleteConfirm = (event, commentId) => {
  event.stopPropagation()

  confirmingDelete.add(commentId)
}

const deleteComment = async (event, commentId) => {
  event.stopPropagation()

  confirmingDelete.delete(commentId)

  const comment = findComment(commentId)
  if (!comment) return

  try {

    await axios.delete(`${rootAPI}/comments/${commentId}`)

    if (comment) {
      // Tìm và xóa comment khỏi danh sách
      const mainCommentIndex = comments.value.findIndex(
        (c) => c.comment && c.comment.id === commentId
      )

      if (mainCommentIndex !== -1) {
        comments.value.splice(mainCommentIndex, 1)
      } else {
        // Nếu không phải comment chính, tìm trong replies
        for (const commentObj of comments.value) {
          if (!commentObj.replies) continue

          const replyIndex = commentObj.replies.findIndex((r) => r.id === commentId)
          if (replyIndex !== -1) {
            commentObj.replies.splice(replyIndex, 1)
            break
          }
        }
      }
    }
  } catch (error) {
    console.error('Error deleting comment:', error)
  }
}

const cancelDeleteConfirm = (event, commentId) => {
  event.stopPropagation()
  confirmingDelete.delete(commentId)
}

const canDelete = (comment) => {
  const userId = currentUserId.value
  if (!userId || !comment) return false

  return userId === comment.userId || (authStore.user && authStore.user.roles?.includes('AMDIN'))
}

const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  return new Date(dateString).toLocaleDateString('vi-VN', options)
}

const findComment = (id) => {
  for (const commentObj of comments.value) {
    if (commentObj.comment.id === id) return commentObj.comment

    if (commentObj.replies) {
      const reply = commentObj.replies.find((r) => r.id === id)
      if (reply) return reply
    }
  }

  return null
}

const handleWebSocketMessage = (message) => {
  try {
    // so sánh lessonId để check xử lý trong bài học hiện tại
    if (message.lessonId && Number(message.lessonId) !== Number(props.lessonId)) {
      console.log(
        `Ignoring message for different lesson: ${message.lessonId}, current: ${props.lessonId}`
      )
      return
    }

    if (!Array.isArray(comments.value)) {
      console.warn('comments.value is not an array. Resetting to empty array.')
      comments.value = []
    }

    switch (message.type) {
      case 'COMMENT':
        if (message.payload) {
          handleNewComment(message.payload)
        }
        break

      case 'REPLY':
        if (message.payload) {
          handleNewReply(message.payload)
        }
        break

      case 'LIKE':
      case 'UNLIKE':
        if (message.payload) {
          updateCommentLike(message.payload)
        }
        break

      case 'DELETE':
        if (message.payload && message.payload.id) {
          handleDeleteComment(message.payload.id)
        } else if (typeof message.payload === 'number' || typeof message.payload === 'string') {
          handleDeleteComment(message.payload)
        }
        break

      default:
        console.log('Unknown message type:', message.type)
    }
  } catch (error) {
    console.error('Error processing WebSocket message:', error)
  }
}

const updateCommentLike = (likeData) => {
  if (!likeData || (!likeData.id && !likeData.commentId)) {
    console.warn('Invalid like data:', likeData)
    return
  }

  if (!Array.isArray(comments.value)) {
    console.warn('comments.value is not an array. Resetting to empty array.')
    comments.value = []
    return
  }

  const commentId = likeData.commentId || likeData.id

  const comment = findComment(commentId)

  if (comment) {
    comment.likeCount = likeData.likeCount !== undefined ? likeData.likeCount : comment.likeCount
    if (currentUserId.value === likeData.userId && likeData.isLiked !== undefined) {
      comment.isLikedByCurrentUser = likeData.isLiked
    }
  } else {
    console.warn('Comment not found for like update. CommentId:', commentId)
  }
}

const handleNewComment = (commentData) => {
  if (!commentData || (!commentData.comment && !commentData.id)) {
    console.warn('Invalid comment data structure:', commentData)
    return
  }

  if (!Array.isArray(comments.value)) {
    console.warn('comments.value is not an array. Resetting to empty array.')
    comments.value = []
  }

  // tìm comment với id
  const existingCommentIndex = comments.value.findIndex(
    (item) => item.comment && item.comment.id === commentData.id
  )

  if (existingCommentIndex >= 0) {
    comments.value[existingCommentIndex].comment = commentData
  } else {
    // mới, thêm vô đầu ds
    comments.value.unshift({
      comment: commentData,
      replies: [],
    })
  }
}

const handleNewReply = (replyData) => {
  try {
    if (!replyData) {
      console.warn('Reply data is null or undefined')
      return
    }

    const parentId = replyData.idOriginalComment

    if (!replyData.id || !parentId) {
      console.warn('Invalid reply data: missing id or parent id', replyData)
      return
    }

    // Đảm bảo comments.value là một mảng
    if (!Array.isArray(comments.value)) {
      console.warn('comments.value is not an array. Resetting to empty array.')
      comments.value = []
      return
    }

    const parentCommentIndex = comments.value.findIndex(
      (item) => item.comment && item.comment.id === parentId
    )

    if (parentCommentIndex >= 0) {
      // Comment cha tồn tại
      const parentComment = comments.value[parentCommentIndex]

      // Khởi tạo mảng replies nếu chưa có
      if (!parentComment.replies) {
        parentComment.replies = []
      } else if (!Array.isArray(parentComment.replies)) {
        // Đảm bảo replies là một mảng
        parentComment.replies = []
        console.warn('Reset replies to empty array because it was not an array')
      }
      // Tìm reply trong danh sách hiện tại
      const existingReplyIndex = parentComment.replies.findIndex((r) => r && r.id === replyData.id)

      if (existingReplyIndex >= 0) {
        parentComment.replies[existingReplyIndex] = replyData
      } else {
        parentComment.replies.push(replyData)
      }
    } else {
      console.warn('Parent comment not found for reply. Parent ID:', parentId)
      fetchComments()
    }
  } catch (error) {
    console.error('Error processing reply:', error)
  }
}

const handleDeleteComment = (commentId) => {
  if (!commentId) return

  if (!Array.isArray(comments.value)) {
    console.warn('comments.value is not an array. Resetting to empty array.')
    comments.value = []
  }

  // tìm và xóa comment chính
  const mainCommentIndex = comments.value.findIndex(
    (item) => item.comment && item.comment.id === commentId
  )

  if (mainCommentIndex >= 0) {
    comments.value.splice(mainCommentIndex, 1)
    return
  }

  // không phải comment chính, tìm trong replies
  for (const commentItem of comments.value) {
    if (!commentItem.replies) continue

    const replyIndex = commentItem.replies.findIndex((r) => r.id === commentId)

    if (replyIndex >= 0) {
      commentItem.replies.splice(replyIndex, 1)
      break
    }
  }
}

watch(
  () => props.lessonId,
  (newId, oldId) => {
    if (newId !== oldId) {
      comments.value = []
      // Cleanup các form và editor khi chuyển bài học
      Object.keys(replyFormVisible).forEach((key) => {
        delete replyFormVisible[key]
        destroyReplyEditor(key)
      })

      // Hủy đăng ký WebSocket cũ
      if (webSocketSubscription.value) {
        webSocketSubscription.value.unsubscribe()
        webSocketSubscription.value = null
      }

      // Đăng ký WebSocket mới
      if (newId) {
        const commentsTopic = `/topic/lesson/${newId}/comments`
        webSocketSubscription.value = webSocketService.subscribe(
          commentsTopic,
          handleWebSocketMessage
        )
      }

      if (props.isOpen) {
        fetchComments()
      }
    }
  },
  { immediate: true }
)

// Thêm lại watch cho props.isOpen đã bị comment
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      fetchComments()
      if (!editor.value) {
        initEditor()
      }

      // Đk WebSocket khi panel mở
      if (props.lessonId && !webSocketSubscription.value) {
        const commentsTopic = `/topic/lesson/${props.lessonId}/comments`
        webSocketSubscription.value = webSocketService.subscribe(
          commentsTopic,
          handleWebSocketMessage
        )
      }
    }
  }
)

onMounted(() => {
  if (props.isOpen) {
    fetchComments()
  }
  initEditor()

  if (props.lessonId) {
    const commentsTopic = `/topic/lesson/${props.lessonId}/comments`
    webSocketSubscription.value = webSocketService.subscribe(commentsTopic, handleWebSocketMessage)
  }
})

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }

  Object.keys(replyEditors).forEach((id) => {
    if (replyEditors[id]) {
      replyEditors[id].destroy()
    }
  })

  // Hủy đăng ký WebSocket
  if (webSocketSubscription.value) {
    webSocketSubscription.value.unsubscribe()
    webSocketSubscription.value = null
  }
})
</script>
  
  <style scoped>
.comment-panel {
  position: fixed;
  top: 0;
  right: -50%;
  width: 50%;
  height: 100vh;
  background-color: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: right 0.3s ease;
  display: flex;
  flex-direction: column;
}

.comment-panel-open {
  right: 0;
}

.comment-panel-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
}

.close-btn:hover {
  color: #333;
}

.comment-panel-content {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.comment-form textarea {
  resize: none;
  border-radius: 6px;
}

.comment-item {
  padding: 16px;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin-bottom: 16px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-sm {
  width: 30px;
  height: 30px;
}

.comment-actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.comment-actions .btn-link {
  padding: 0;
  color: #666;
  text-decoration: none;
}

.reply-form textarea {
  resize: none;
  font-size: 14px;
}

.comment-replies {
  margin-left: 20px;
  padding-left: 15px;
  border-left: 2px solid #e0e0e0;
}

.reply-item {
  padding: 12px;
  border-radius: 6px;
  background-color: #f2f2f2;
  margin-bottom: 10px;
  font-size: 14px;
}

.user-info {
  margin-left: 10px;
}

.ml-2 {
  margin-left: 8px;
}
/* editor */
.editor-wrapper {
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
}

.editor-toolbar {
  display: flex;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.editor-toolbar button {
  background: none;
  border: none;
  margin-right: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  color: #555;
}

.editor-toolbar button:hover {
  background-color: #e0e0e0;
}

.editor-toolbar button.is-active {
  background-color: #e0e0e0;
  color: #0084ff;
}

:deep(.tiptap-editor) {
  padding: 12px;
  min-height: 50px;
  outline: none;
}

:deep(.tiptap-editor p) {
  margin: 0;
}
:deep(.tiptap-editor p.is-editor-empty:first-child::before) {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

:deep(.tiptap-editor pre) {
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 8px;
  font-family: 'Courier New', Courier, monospace;
}

:deep(.tiptap-editor ul) {
  padding-left: 20px;
}

.placeholder-box {
  display: flex;
  align-items: center;
  background-color: #f0f5fb;
  padding: 12px;
  border-radius: 8px;
  cursor: text;
}

/* xác nhận xóa */
.delete-confirm-buttons {
  display: inline-flex;
  align-items: center;
}

.delete-confirm-buttons .btn {
  padding: 0.15rem 0.5rem;
  font-size: 0.8rem;
  animation: fadeIn 0.2s;
}

.delete-confirm-buttons .btn-danger {
  background-color: #ff4d4f;
  border: none;
}

.delete-confirm-buttons .btn-light {
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.comment-item.deleting, .reply-item.deleting {
  opacity: 0.5;
  pointer-events: none;
  transition: opacity 0.3s ease;
}
</style>