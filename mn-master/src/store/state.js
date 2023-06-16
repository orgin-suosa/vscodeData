export default {
  oldAgePensionState: {
    preTaxWages: '', // 税前月工资(元）
    lastAverageWage: '', // 本市职工上年度月平均工资(元）
    oneselfAge: null, // 年龄（岁）
    retireAge: null, // 预计退休年龄（岁）
    accumulatedPension: '', // 帐户累积养老金额
    pensionRatio: '', // 养老金缴费比例
    wageGrowthRate: '5', // 个人工资增长率
    wageGrowthRateCity: '3', // 本市职工工资增长率
    retirementSalary: '', // 期望退休后每月生活水平
  },
  oneselfAge: null, // 年龄（岁）
  retireAge: null, // 预计退休年龄（岁）
  // 养老金测算结果
  recordDate: {
    age: null,
    monthRetireMoneyByExpect: null,
    monthRetireMoneyByResult: null,
    monthSalaryByPreTax: null,
    pensionGapMonth: null,
    pensionGapYear: null,
    retirementAge: null,
    type: null,

  },
  recordID: null

};
