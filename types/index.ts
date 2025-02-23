export type NoteWithUser = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: {
    id: string;
    username: string;
  };
};

export type FileWithUser = {
  id: string;
  name: string;
  path: string;
  createdAt: Date;
  userId: string;
  user: {
    id: string;
    username: string;
  };
};
