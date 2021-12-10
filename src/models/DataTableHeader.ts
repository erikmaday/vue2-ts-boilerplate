import { VuetifyItem } from "./VuetifyItem";

export interface DataTableHeader extends VuetifyItem {
  computedText?: (row: any) => string
}
