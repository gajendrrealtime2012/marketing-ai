interface Section {
  name: string;
  instruction?: string;
}

export interface OutputType {
  id: string;
  output_type_name: string;
  description?: string;
  sections: Section[];
  created_at?: Date;
  updated_at?: Date;
}
