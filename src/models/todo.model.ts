interface Create {
  title: string;
  description: string;
  deadline: Date;
}

interface Update {
  title: string;
  description: string;
  deadline: Date;
  done: boolean;
}

interface Detail {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  done: boolean;
}

export default interface Todo {
  detail: Detail,
  create: Create,
  update: Update
}