
export type RequestType = {
  type: 'add' | 'update' | 'remove' | 'read' | 'list';
  user: string;
  title?: string;
  body?: string;
  color?: string;
  newTitle?: string;
  newBody?: string;
  newColor?: string;
}

export type ResponseType = {
  type: 'add' | 'update' | 'remove' | 'read' | 'list';
  success: boolean;
  notes?: {
    title: string,
    body: string,
    color: string,
  }[];
  modified?: string;
}
