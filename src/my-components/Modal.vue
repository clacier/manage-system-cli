<template>
  <div class="modal_box">
    <div v-if="visible" class="modal_mask"></div>
    <transition name="slide-fade">
      <div v-if="visible && isReload">
        <div
          class="modal_content"
          :class="{ modal_content_large: isLarge }"
          :style="
            `${
              isLarge
                ? ''
                : `width:${modalWidth}px;
        margin-left:-${modalWidth / 2}px;
        left:${left}px;top:${top}px`
            }`
          "
        >
          <div class="modal_header" @mousedown="handleDarg">
            <div class="modal_title">{{ title }}</div>
            <div class="modal_action">
              <a-icon type="line" class="cursor" @click="handleShrink" v-if="isLarge" />
              <a-icon type="border" class="cursor" @click="handleEnlarge" v-else />
              <a-icon style="margin-left:10px" type="close" @click="handleCancel" id="close" class="cursor" />
            </div>
          </div>
          <div class="modal_body">
            <slot></slot>
          </div>
          <div class="modal_bottom" v-if="!hideFooter">
            <a-button :size="isLarge ? 'large' : 'default'" type="primary" @click="handleOk" style="margin-right: 10px"
              >确认</a-button
            >
            <a-button :size="isLarge ? 'large' : 'default'" @click="handleCancel">取消</a-button>
          </div>
        </div>
      </div>
      <div v-show="visible && !isReload">
        <div
          :class="{ modal_content_large: isLarge }"
          class="modal_content"
          :style="
            `${
              isLarge
                ? ''
                : `width:${modalWidth}px;
        margin-left:-${modalWidth / 2}px;
        left:${left}px;top:${top}px`
            }`
          "
        >
          <div class="modal_header" @mousedown="handleDarg">
            <div class="modal_title">{{ title }}</div>
            <div class="modal_action">
              <a-icon type="line" class="cursor" @click="handleShrink" v-if="isLarge" />
              <a-icon type="border" class="cursor" @click="handleEnlarge" v-else />
              <a-icon style="margin-left:10px" type="close" @click="handleCancel" id="close" class="cursor" />
            </div>
          </div>
          <div class="modal_body">
            <slot></slot>
          </div>

          <div class="modal_bottom" v-if="!hideFooter">
            <a-button :size="isLarge ? 'large' : 'default'" type="primary" @click="handleOk" style="margin-right: 10px"
              >确认</a-button
            >
            <a-button :size="isLarge ? 'large' : 'default'" @click="handleCancel">取消</a-button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  model: {
    prop: 'visible', //这个字段，是指父组件设置 v-model 时，将变量值传给子组件的 msg
    event: 'visible-event' //这个字段，是指父组件监听 parent-event 事件
  },
  watch: {
    width(val) {
      this.modalWidth = val
    }
  },
  props: {
    width: {
      default: 520,
      required: false
    },
    isReload: {
      default: false,
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
      oldLeft: '',
      oldTop: '',
      modalWidth: 520,
      isLarge: false,
      top: ''
    }
  },
  created() {
    this.modalWidth = this.width
  },
  methods: {
    handleDarg(e) {
      if (e.target.nodeName === 'path' || e.target.nodeName === 'svg' || this.isLarge) {
        return
      }
      let startX = e.pageX
      console.log(e)
      let startLeft = e.target.offsetParent.offsetParent.offsetLeft
      let startTop = e.target.offsetParent.offsetParent.offsetTop
      let startY = e.pageY
      let marL = this.width / 2
      console.log(startLeft)
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
    handleEnlarge() {
      this.isLarge = true
    },
    handleShrink() {
      this.isLarge = false
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
  //   transition: all 0.s cubic-bezier(1, 0.5, 0.8, 0.8);
}
.slide-fade-leave-active {
  //   transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 0.8);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  // transform: translateX(500px);
  z-index: 99;
  //   transform: scale(0);
  opacity: 0;
}
.modal_box {
  position: relative;
  .modal_header_box {
    position: relative;
    width: 100%;
  }
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
  .enlarge_btn {
    position: relative;
  }
  .enlarge_btn_icon2 {
    position: absolute;
    top: -3px;
    right: -5px;
  }
  .modal_header {
    width: 100%;
    padding: 0 15px;
    display: flex;
    cursor: move;
    position: relative;
    background: #1890ff;
    color: #ffffff;
    // position: relative;
    justify-content: center;
    align-items: center;
    .modal_action {
      position: absolute;
      right: 10px;
      top: 50%;
      display: flex;
      align-items: center;
      transform: translateY(-50%);
    }
  }
  .modal_content {
    position: fixed;
    left: 50%;
    z-index: 200;
    margin-left: -260px;
    top: 50%;
    transform: translateY(-50%);

    // transition-duration: 1s;
    background: #ffffff;
  }
  .modal_content_large {
    position: fixed;
    left: 0;
    z-index: 200;
    width: 100%;
    height: 100vh;
    margin-left: 0;
    top: 0;
    transform: translateY(0);
    background: #ffffff;
    .modal_header {
      cursor: default;
    }
    .modal_body {
      padding: 15px;
      height: calc(100vh - 104px);
      max-height: calc(100vh - 110px);

      overflow: auto;
    }
  }
  .modal_body {
    padding: 15px;
    max-height: 70vh;
    overflow: auto;
  }
  .modal_title {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
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
