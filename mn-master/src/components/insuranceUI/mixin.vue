<script>
export default {
  props: ['name', 'isTitle', 'placeholder', 'value', 'extendValue', 'field', 'extendField', 'list', 'data', 'roleType', 'BankList', 'maxlength', 'inputType', 'isDisable', 'titleSwitch', 'defaultAge'],
  data() {
    return {
      showPopup: false,
    };
  },
  methods: {
    chageEvent($event) {
      const v = $event.target.value;
      this.$emit('changeValue', this.field, v);
    },
    inputEvent(val) {
      this.$emit('changeValue', this.field, val);
    },
    openPopup() {
      this.showPopup = true;
    },
    cancel() {
      this.showPopup = false;
    },
  },
};
</script>
