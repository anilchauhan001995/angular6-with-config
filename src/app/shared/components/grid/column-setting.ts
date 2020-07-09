export interface ColumnSetting {
    field: string;
    title: string;
    format?: string;
    type: 'text' | 'numeric' | 'boolean' | 'date' | 'json';
    filterable?: string;
    width?: string;
    editor?: string;
    filter?: string;
    default?: string;
    showCheckBox?: string;
    dataKey?: string;
    iconLabel?: string;
    iconTooltip?: string;
    iconSelectAllTooltip?: string;
    isTranslationRequired?: boolean;
  }
  