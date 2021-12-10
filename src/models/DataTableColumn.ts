import { VuetifyItem } from "./VuetifyItem";

export interface DataTableColumn extends VuetifyItem {
  computedText?: (row: any) => string
}
