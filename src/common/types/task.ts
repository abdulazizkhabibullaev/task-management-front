export interface Task {
  _id?: string;
  title: string;
  description?: string;
  project_id: string;
  user_id?: string;
  status: 'to_do' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: Date;
  created_at?: Date;
  updated_at?: Date;
}
