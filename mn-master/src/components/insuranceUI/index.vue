<template>
  <div class="form-wrap">
    <div v-for="(item, i) in templateData" :key="i">
      <gs-role v-if="item.type === 'role'" v-model="appData[item.field]" :name="item.name" :field="item.field" @changeValue="changeAppFormData" />
      <gs-gender v-if="item.type == 'gender'" v-model="appData[item.field]" :name="item.name" :field="item.field" @changeValue="changeAppFormData" :is-disable="appData[item.isDisable]" />
      <gs-age
        v-if="item.type == 'age'"
        v-model="appData[item.field]"
        :name="item.name"
        :field="item.field"
        :extend-field="item.extendField"
        :extend-value="appData[item.extendField]"
        @changeValue="changeAppFormData"
        :is-disable="appData[item.isDisable]"
      />
      <gs-birthday
        v-if="item.type == 'birthday'"
        v-model="appData[item.field]"
        :name="item.name"
        :field="item.field"
        :extend-field="item.extendField"
        :extend-value="appData[item.extendField]"
        :placeholder="item.placeholder"
        @changeValue="changeAppFormData"
        :is-disable="appData[item.isDisable]"
      />
      <gs-import
        v-if="item.type == 'import'"
        v-model="appData[item.field]"
        :name="item.name"
        :list="item.list"
        :field="item.field"
        :extend-field="item.extendField"
        :role-type="appData.role"
        :extend-value="appData[item.extendField]"
        @changeValue="changeAppFormData"
        :title-switch="appData[item.titleSwitch]"
      />
      <gs-check v-if="item.type == 'check'" v-model="appData[item.field]" :name="item.name" :field="item.field" @changeValue="changeAppFormData" :is-disable="appData[item.isDisable]" />
      <gs-table
        v-if="item.type == 'table'"
        v-model="appData[item.field]"
        :name="item.name"
        :list="item.list"
        :field="item.field"
        :extend-field1="item.extendField1"
        :extend-field2="item.extendField2"
        :extend-value1="appData[item.extendField1]"
        :extend-value2="appData[item.extendField2]"
        @changeValue="changeAppFormData"
        :is-disable="appData[item.isDisable]"
      />
      <gs-title v-if="item.type == 'title'" v-model="appData[item.field]" :name="item.name" :field="item.field" @changeValue="changeAppFormData" />
      <gs-input
        v-if="item.type == 'input'"
        v-model="appData[item.field]"
        :name="item.name"
        :field="item.field"
        :data="item.data"
        :placeholder="item.placeholder"
        @changeValue="changeAppFormData"
        :is-disable="appData[item.isDisable]"
      />
      <gs-length
        v-if="item.type == 'length'"
        v-model="appData[item.field]"
        :name="item.name"
        :field="item.field"
        :data="item.data"
        :placeholder="item.placeholder"
        :maxlength="item.maxlength"
        :inputType="item.inputType"
        @changeValue="changeAppFormData"
        :is-disable="appData[item.isDisable]"
      />
      <gs-select
        v-if="item.type == 'select'"
        v-model="appData[item.field]"
        :name="item.name"
        :field="item.field"
        :placeholder="item.placeholder"
        @changeValue="changeAppFormData"
        :is-disable="appData[item.isDisable]"
      />
      <gs-bank
        v-if="item.type == 'bank'"
        v-model="appData[item.field]"
        :BankList="appData[item.BankList]"
        :name="item.name"
        :field="item.field"
        :placeholder="item.placeholder"
        @changeValue="changeAppFormData"
        :is-disable="appData[item.isDisable]"
      />

      <gs-model
        v-if="item.type == 'model'"
        v-model="appData[item.field]"
        :name="item.name"
        :list="item.list"
        :field="item.field"
        :placeholder="item.placeholder"
        @changeValue="changeAppFormData"
        :is-disable="appData[item.isDisable]"
      />
      <gs-model-multiple
        v-if="item.type == 'modelMultiple'"
        v-model="appData[item.field]"
        :name="item.name"
        :list="item.list"
        :field="item.field"
        :placeholder="item.placeholder"
        @changeValue="changeAppFormData"
        :is-disable="appData[item.isDisable]"
      />
    </div>
  </div>
</template>

<script>
import GsAge from './gs-age';
import GsRole from './gs-role';
import GsBirthday from './gs-birthday';
import GsImport from './gs-title-import';
import GsGender from './gs-gender';
import GsCheck from './gs-check';
// import GsTable from './gs-table';
import GsTitle from './gs-title';
import GsInput from './gs-input';
import GsLength from './gs-input-custom-length';
import GsSelect from './gs-select';
import GsBank from './gs-bank';
import GsModel from './gs-model';
import GsModelMultiple from './gs-model-multiple';

export default {
  components: {
    GsAge,
    GsRole,
    GsGender,
    GsBirthday,
    GsImport,
    GsCheck,
    GsTitle,
    GsInput,
    GsLength,
    GsSelect,
    GsBank,
    GsModel,
    GsModelMultiple,
  },
  props: {
    templateData: {
      type: Array,
      default: () => [],
    },
    appData: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    changeAppFormData(key, val, BankList) {
      console.log(this.appData, 'changeAppFormData');
      this.$emit('changeAppFormData', key, val, BankList);
    },
    // switchChange(titleSwitch) {
    //   this.$emit('changeAppFormData', key, val, BankList);
    // },
  },
};
</script>
