
export class fielditem {
  selected: boolean;
  label: string;
  fieldname: string;
  constructor(label: string, fieldname: string) {
    this.label = label;
    this.fieldname = fieldname;
    this.selected = false;
  }
}
