<template>
  <div class="FormList">
    <a-form :form="form" class="formBox">
      <a-form-item
        v-for="(item, i) in columns"
        :key="i + 'e'"
        :style="
          `width:${item.width ? item.width : '100%'}; ${
            isSearch ? `margin:0 10px;width:${item.width ? item.width : 'auto'}` : ``
          }`
        "
        :label-col="isSearch ? {} : formItemLayout.labelCol"
        :wrapper-col="isSearch ? {} : formItemLayout.wrapperCol"
        :label="item.label"
      >
        <a-select
          v-if="item.type === 'select'"
          :mode="item.mode"
          v-decorator="[
            item.key,
            {
              initialValue: detailInfo[item.key] ? detailInfo[item.key] : item.initValue,
              rules: [{ required: item.required, message: item.placeholder, ...item.rules }]
            }
          ]"
          :placeholder="item.placeholder"
          style="width: 100%"
        >
          <a-select-option :key="selectItem.name" v-for="selectItem in item.option" :value="selectItem.value">
            {{ selectItem.name }}
          </a-select-option>
        </a-select>
        <a-switch
          :defaultChecked="detailInfo[item.key] ? detailInfo[item.key] : item.initValue"
          v-else-if="item.type === 'switch'"
          v-decorator="[
            item.key,
            {
              initialValue: detailInfo[item.key] ? detailInfo[item.key] : item.initValue,
              rules: [{ required: item.required, message: item.placeholder, ...item.rules }]
            }
          ]"
        />
        <a-radio-group
          v-else-if="item.type === 'radio'"
          v-decorator="[
            item.key,
            {
              initialValue: detailInfo[item.key] ? detailInfo[item.key] : item.initValue,
              rules: [{ required: item.required, message: item.placeholder, ...item.rules }]
            }
          ]"
          :placeholder="item.placeholder"
          button-style="solid"
        >
          <a-radio-button :key="radioItem.name" v-for="radioItem in item.option" :value="radioItem.value">
            {{ radioItem.name }}
          </a-radio-button>
        </a-radio-group>
        <a-checkbox-group
          v-else-if="item.type === 'checkbox'"
          v-decorator="[
            item.key,
            {
              initialValue: detailInfo[item.key] ? detailInfo[item.key] : item.initValue,
              rules: [{ required: item.required, message: item.placeholder, ...item.rules }]
            }
          ]"
          :placeholder="item.placeholder"
          button-style="solid"
        >
          <a-checkbox :key="checkItem.name" v-for="checkItem in item.option" :value="checkItem.value">
            {{ checkItem.name }}
          </a-checkbox>
        </a-checkbox-group>
        <a-date-picker
          v-else-if="item.type === 'date'"
          style="width: 100%"
          :showTime="item.showTime"
          v-decorator="[
            item.key,
            {
              initialValue: detailInfo[item.key] ? detailInfo[item.key] : item.initValue,
              rules: [{ required: item.required, message: item.placeholder, ...item.rules }]
            }
          ]"
          :placeholder="item.placeholder"
        />
        <a-textarea
          v-else-if="item.type === 'textarea'"
          style="width: 100%"
          v-decorator="[
            item.key,
            {
              initialValue: detailInfo[item.key] ? detailInfo[item.key] : item.initValue,
              rules: [{ required: item.required, message: item.placeholder, ...item.rules }]
            }
          ]"
          :placeholder="item.placeholder"
        />
        <div v-else-if="item.type === 'slot'">
          <slot :name="item.slotName"></slot>
        </div>
        <div v-else-if="item.type == 'password'">
          <a-input-password
            allow-clear
            v-decorator="[
              item.key,
              {
                initialValue: detailInfo[item.key] ? detailInfo[item.key] : item.initValue,
                rules: [{ required: item.required, message: item.placeholder, ...item.rules }]
              }
            ]"
            :placeholder="item.placeholder"
          />
        </div>
        <a-input
          v-else
          allowClear
          v-decorator="[
            item.key,
            {
              initialValue: detailInfo[item.key] ? detailInfo[item.key] : item.initValue,
              rules: [{ required: item.required, message: item.placeholder, ...item.rules }]
            }
          ]"
          :placeholder="item.placeholder"
        />
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
}
import { message, Modal } from 'ant-design-vue'

export default {
  name: 'FormList',
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    defautInfo: {
      default: () => {}
    },
    isSearch: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    defautInfo(val) {
      this.detailInfo = this.defautInfo || {}
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      detailInfo: '',
      formItemLayout
    }
  },
  created() {
    this.detailInfo = this.defautInfo || {}
  },
  mounted() {},
  methods: {
    handleSubmit() {
      let data = false
      this.form.validateFields((err, values) => {
        if (!err) {
          let dateFormArr = this.columns.filter(item => item.type === 'date' || item.type === 'dateTime')
          dateFormArr.forEach(item => {
            values[item.key] = values[item.key] ? values[item.key].format('YYYY-MM-DD HH:mm:ss') : ''
          })
          console.log(values)
          data = values
        }
      })
      return data
    }
  }
}
</script>
<style lang="less" scoped>
.formBox {
  display: flex;
  flex-wrap: wrap;
}
</style>
