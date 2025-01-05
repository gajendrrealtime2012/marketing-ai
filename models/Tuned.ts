export interface Tuned {
  id: string;
  seed_id: string;
  persona_id: string;
  output_type_id: string;
  data: string; // Adjust this to match your tuned data structure
  created_at?: Date;
  updated_at?: Date;
}
