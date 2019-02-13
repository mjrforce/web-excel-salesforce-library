export class QueryMapItem {
  colname: string;
  colindex: number;
  fieldname: string;

  constructor(f?: string, c?: string) {
    this.colname = c;
    this.fieldname = f;
    if (c != '' && c != null)
      this.colindex = this.charToNumber(c);
  }

  charToNumber(val: string) {

    var base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var baseNumber = base.length;
    var runningTotal = 0;
    var characterIndex = 0;
    var indexExponent = val.length - 1;

    while (characterIndex < val.length) {
      var digit = val[characterIndex];
      var digitValue = base.indexOf(digit) + 1;
      runningTotal += Math.pow(baseNumber, indexExponent) * digitValue;
      characterIndex += 1
      indexExponent -= 1
    }
    return runningTotal;
  }
}
