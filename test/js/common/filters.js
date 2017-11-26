
// 格式化html吗？
// 转义html
String.prototype.escapeHtml = function(isAttr){
    if(isAttr) return $('<div>').text(this).html().replace('"', '\\"');
    return $('<div>').text(this).html();
};


/*数字格式化
  exmple: var d= 11000.1155, dFormat = d.format(2,',') -> 11,000.12
  companyMin和company, 表示大于等于companyMin时用company单位
*/
Number.prototype.format =function(precision, separator, companyMin, company){
  var companyTxt = {
    '10': '十',
    '100': '百',
    '1000': '千',
    '10000': '万'
  };
  var parts, num = this, txt = '';
      // 判断是否为数字
      if (!isNaN(parseFloat(num)) && isFinite(num)) {
          // 把类似 .5, 5. 之类的数据转化成0.5, 5, 为数据精度处理做准, 至于为什么
          // 不在判断中直接写 if (!isNaN(num = parseFloat(num)) && isFinite(num))
          // 是因为parseFloat有一个奇怪的精度问题, 比如 parseFloat(12312312.1234567119)
          // 的值变成了 12312312.123456713
          num = Number(num);
          //处理单位
          if(companyMin && company && num>=companyMin){
            num = Math.floor(num/company);
            txt = companyTxt[company+'']+'+';
          }
          // 处理小数点位数
          num = (typeof precision !== 'undefined' ? num.toFixed(precision) : num).toString();
          // 分离数字的小数部分和整数部分
          parts = num.split('.');
          // 整数部分加[separator]分隔, 借用一个著名的正则表达式
          parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (separator || ','));

          return parts.join('.')+txt;
      }
      return NaN;
}
