interface Create {
  title: string;
  description: string;
  snapshot: File | null;
  deadline: Date;
}

interface Update {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  snapshot: File | null;
  status: string;
  done: boolean;
}

interface Detail {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  status: string;
  done: boolean;
  snapshotpath: string;
  updated: Date;
}

export default interface Todo {
  detail: Detail,
  create: Create,
  update: Update
}