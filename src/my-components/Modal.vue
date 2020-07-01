<template>
  <div class="modal_box">
    <div v-if="visible" class="modal_mask" @click="handleCancel"></div>
    <transition name="slide-fade">
      <div v-if="visible">
        <div
          class="modal_content"
          :style="`width:${width}px;
        margin-left:-${width/2}px;
        left:${left}px;top:${top}px`"
        >
          <div class="modal_header">
            <div class="modal_title" @mousedown="handleDarg">{{title}}</div>
            <a-icon type="close" @click="handleCancel" class="cursor" />
          </div>
          <div class="modal_body">
            <slot></slot>
          </div>
          <div class="modal_bottom" v-if="!hideFooter">
            <a-button type="primary" @click="handleOk" style="margin-right:10px">确认</a-button>
            <a-button @click="handleCancel">取消</a-button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'visible', //这个字段，是指父组件设置 v-model 时，将变量值传给子组件的 msg
    event: 'visible-event' //这个字段，是指父组件监听 parent-event 事件
  },
  props: {
    width: {
      default: 520,
      required: false
    },
    visible: {
      default: false,
      required: false
    },
    hideFooter: {
      type: [Boolean],
      default: false,
      required: false
    },
    title: {
      type: [String],
      default: true,
      required: false
    },
    logo: {
      type: String,
      default: '',
      required: false
    }
  },
  data() {
    return {
      opacity: 0,
      left: '',
      top: ''
    }
  },
  methods: {
    handleDarg(e) {
      console.log(e)
      let startX = e.pageX
      let startLeft = e.target.offsetParent.offsetLeft
      let startTop = e.target.offsetParent.offsetTop
      let startY = e.pageY
      let marL = this.width / 2
      let left = window.screen.availWidth / 2
      this.isDrag = true
      // return false
      ;(document.onmousemove = e => {
        if (this.isDrag) {
          this.left = startLeft + e.pageX - startX + marL
          this.top = startTop + e.pageY - startY
        }
      }),
        (document.onmouseup = e => {
          this.isDrag = false
          document.onmousemove = null
          document.onmouseup = null
        })
    },
    handleOk() {
      this.$emit('ok')
    },
    handleCancel() {
      this.left = ''
      this.top = ''
      this.$emit('visible-event')
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="less" scoped>
.slide-fade-enter-active {
  transition: all 0.5s ease;
}
.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  // transform: translateX(500px);
  z-index: 99;
  transform: scale(0);
  opacity: 0;
}
.modal_box {
  position: relative;
  .modal_mask {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
    background: #333333;
    opacity: 0.2;
    width: 100%;
    height: 100vh;
  }
  .modal_header {
    width: 100%;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e8e8e8;
  }
  .modal_content {
    position: fixed;
    left: 50%;
    z-index: 200;
    margin-left: -260px;
    top: 10vh;

    // transition-duration: 1s;
    background: #ffffff;
  }
  .modal_body {
    padding: 15px;
    max-height: 70vh;
    overflow: auto;
  }
  .modal_title {
    width: 90%;
    cursor: move;
  }
  .modal_bottom {
    width: 100%;
    display: flex;
    padding: 10px 15px;
    border-top: 1px solid #e8e8e8;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>