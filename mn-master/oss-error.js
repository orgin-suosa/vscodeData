/* eslint-disable */
const fs = require('fs');
const path = require('path');
const program = require('commander');
const pathError = path.resolve(process.cwd(), './.error-log')
const ResetPathFile = require('@manniu-core/reset-pathfile-plugin');

program
  .command('mode <mode>')
  .description('备份log日志')
  .action(function (mode) {
    // 判断.error-log文件是否存在
    fs.stat(pathError, (err, stats) => {
      // 如果不存在，就正常执行
      if (err) {
        console.log('正常执行！');
      } else {
        new ResetPathFile(mode, 1);
      }
    });
  });

program
  .command('check <value>')
  .description('检查.error-log是否已删除')
  .action(function (mode) {
    // 判断.error-log文件是否存在
    fs.stat(pathError, (err, stats) => {
      // 如果不存在，就正常执行
      if (err) {
        console.log('正常执行！');
      } else {
        // 如果存在，执行下面的脚本
        fs.unlink(pathError, (err) => {
          if (err) throw err;
          console.log('.error-log文件已被删除');
          throw new Error('请联系运维同学去oss服务器手动copy版本控制相关文件');
        });
      }
    });
  });

program.parse(process.argv);
