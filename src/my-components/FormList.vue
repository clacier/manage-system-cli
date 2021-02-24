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
      >
        <span slot="label" v-if="item.label">
          <span v-if="item.label"> {{ item.label }}</span>

          <a-tooltip style="margin-left:5px" v-if="item.title" :title="item.title.text" :style="item.title.style">
            <a-icon type="question-circle-o" />
          </a-tooltip>
        </span>
        <a-select
          v-if="item.type === 'select'"
          :mode="item.mode"
          v-decorator="[
            item.key,
            {
              initialValue: detailInfo[item.key] !== undefined ? detailInfo[item.key] : item.initValue,
              rules: [
                { required: item.required, message: item.placeholder },
                ...(item.rules ? item.rules : []),
                ...(item.validator
                  ? [
                      {
                        validator: (rule, value, callback) => {
                          return item.validator(rule, value, callback, form)
                        }
                      }
                    ]
                  : [])
              ]
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
              initialValue: detailInfo[item.key] !== undefined ? detailInfo[item.key] : item.initValue,
              rules: [
                { required: item.required, message: item.placeholder },
                ...(item.rules ? item.rules : []),
                ...(item.validator
                  ? [
                      {
                        validator: (rule, value, callback) => {
                          return item.validator(rule, value, callback, form)
                        }
                      }
                    ]
                  : [])
              ]
            }
          ]"
        />
        <a-radio-group
          v-else-if="item.type === 'radio'"
          v-decorator="[
            item.key,
            {
              initialValue: detailInfo[item.key] !== undefined ? detailInfo[item.key] : item.initValue,
              rules: [
                { required: item.required, message: item.placeholder },
                ...(item.rules ? item.rules : []),
                ...(item.validator
                  ? [
                      {
                        validator: (rule, value, callback) => {
                          return item.validator(rule, value, callback, form)
                        }
                      }
                    ]
                  : [])
              ]
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
              initialValue: detailInfo[item.key] !== undefined ? detailInfo[item.key] : item.initValue,
              rules: [
                { required: item.required, message: item.placeholder },
                ...(item.rules ? item.rules : []),
                ...(item.validator
                  ? [
                      {
                        validator: (rule, value, callback) => {
                          return item.validator(rule, value, callback, form)
                        }
                      }
                    ]
                  : [])
              ]
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
              initialValue: detailInfo[item.key] !== undefined ? detailInfo[item.key] : item.initValue,
              rules: [
                { required: item.required, message: item.placeholder },
                ...(item.rules ? item.rules : []),
                ...(item.validator
                  ? [
                      {
                        validator: (rule, value, callback) => {
                          return item.validator(rule, value, callback, form)
                        }
                      }
                    ]
                  : [])
              ]
            }
          ]"
          :placeholder="item.placeholder"
        >
        </a-date-picker>
        <a-textarea
          v-else-if="item.type === 'textarea'"
          style="width: 100%"
          v-decorator="[
            item.key,
            {
              initialValue: detailInfo[item.key] !== undefined ? detailInfo[item.key] : item.initValue,
              rules: [
                { required: item.required, message: item.placeholder },
                ...(item.rules ? item.rules : []),
                ...(item.validator
                  ? [
                      {
                        validator: (rule, value, callback) => {
                          return item.validator(rule, value, callback, form)
                        }
                      }
                    ]
                  : [])
              ]
            }
          ]"
          :placeholder="item.placeholder"
        >
        </a-textarea>
        <div v-else-if="item.type === 'slot'">
          <slot :name="item.slotName"></slot>
        </div>
        <a-input-password
          v-else-if="item.type == 'password'"
          allow-clear
          v-decorator="[
            item.key,
            {
              initialValue: detailInfo[item.key] !== undefined ? detailInfo[item.key] : item.initValue,
              rules: [
                { required: item.required, message: item.placeholder },
                ...(item.rules ? item.rules : []),
                ...(item.validator
                  ? [
                      {
                        validator: (rule, value, callback) => {
                          return item.validator(rule, value, callback, form)
                        }
                      }
                    ]
                  : [])
              ]
            }
          ]"
          :placeholder="item.placeholder"
        >
          <a-icon
            slot="prefix"
            v-if="item.prefix ? item.prefix.iconType : false"
            :type="item.prefix.iconType"
            :style="item.prefix.style"
          />
        </a-input-password>
        <a-input-number
          v-else-if="item.type === 'number'"
          allowClear
          style="min-width:100px;width:100%"
          :min="item.min"
          :max="item.max"
          v-decorator="[
            item.key,
            {
              initialValue: detailInfo[item.key] !== undefined ? detailInfo[item.key] : item.initValue,
              rules: [
                { required: item.required, message: item.placeholder },
                ...(item.rules ? item.rules : []),
                ...(item.validator
                  ? [
                      {
                        validator: (rule, value, callback) => {
                          return item.validator(rule, value, callback, form)
                        }
                      }
                    ]
                  : [])
              ]
            }
          ]"
          :placeholder="item.placeholder"
        >
          <a-icon
            slot="prefix"
            v-if="item.prefix ? item.prefix.iconType : false"
            :type="item.prefix.iconType"
            :style="item.prefix.style"
          />
        </a-input-number>
        <div v-else-if="item.type === 'color'" class="flex_box" style="align-items:center">
          <a-input
            style="margin-right:20px"
            allow-clear
            v-decorator="[
              item.key,
              {
                initialValue: detailInfo[item.key] ? detailInfo[item.key] : item.initValue,
                rules: [
                  { required: item.required, message: item.placeholder },
                  ...(item.rules ? item.rules : []),
                  ...(item.validator
                    ? [
                        {
                          validator: (rule, value, callback) => {
                            return item.validator(rule, value, callback, form)
                          }
                        }
                      ]
                    : [])
                ]
              }
            ]"
            :placeholder="item.placeholder"
          >
            <a-icon
              slot="prefix"
              v-if="item.prefix ? item.prefix.iconType : false"
              :type="item.prefix.iconType"
              :style="item.prefix.style"
            />
          </a-input>
          <a-input
            type="color"
            allow-clear
            v-decorator="[
              item.key,
              {
                initialValue: detailInfo[item.key] ? detailInfo[item.key] : item.initValue,
                rules: [
                  { required: item.required, message: item.placeholder },
                  ...(item.rules ? item.rules : []),
                  ...(item.validator
                    ? [
                        {
                          validator: (rule, value, callback) => {
                            return item.validator(rule, value, callback, form)
                          }
                        }
                      ]
                    : [])
                ]
              }
            ]"
            :placeholder="item.placeholder"
          >
          </a-input>
        </div>
        <a-input
          v-else
          :type="item.type"
          allowClear
          :maxLength="item.maxLength"
          v-decorator="[
            item.key,
            {
              initialValue: detailInfo[item.key] !== undefined ? detailInfo[item.key] : item.initValue,
              rules: [
                { required: item.required, message: item.placeholder },
                ...(item.rules ? item.rules : []),
                ...(item.validator
                  ? [
                      {
                        validator: (rule, value, callback) => {
                          return item.validator(rule, value, callback, form)
                        }
                      }
                    ]
                  : [])
              ]
            }
          ]"
          :placeholder="item.placeholder"
        >
          <a-icon
            slot="prefix"
            v-if="item.prefix ? item.prefix.iconType : false"
            :type="item.prefix.iconType"
            :style="item.prefix.style"
          />
        </a-input>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { message, Modal } from 'ant-design-vue'

export default {
  name: 'FormList',
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    defaultInfo: {
      default: () => {}
    },
    isSearch: {
      type: Boolean,
      default: false
    },
    formItemLayout: {
      type: Object,
      default: () => {
        return {
          labelCol: { span: 5 },
          wrapperCol: { span: 15 }
        }
      }
    }
  },
  watch: {
    defaultInfo(val) {
      this.detailInfo = this.defaultInfo || {}
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      detailInfo: '',
      formList: []
    }
  },
  created() {
    this.detailInfo = this.defaultInfo || {}
  },
  mounted() {},
  methods: {
    handleSubmit() {
      let data = ''
      this.form.validateFields((err, values) => {
        if (!err) {
          let dateFormArr = this.columns.filter(item => item.type === 'date' || item.type === 'dateTime')
          dateFormArr.forEach(item => {
            values[item.key] = values[item.key] ? values[item.key].format('YYYY-MM-DD HH:mm:ss') : ''
          })
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
