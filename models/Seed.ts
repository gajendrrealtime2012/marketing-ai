interface Attachment {
  url: string;
  description?: string;
}

export interface Seed {
  id: string;
  seed_url: string;
  seed: string;
  attachments: Attachment[];
  created_at?: Date;
  updated_at?: Date;
}
