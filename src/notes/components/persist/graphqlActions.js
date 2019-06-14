const CreateEntry = `mutation createJournal($title: String!, $body: String) {
  createJournal(input: {title: $title,body:$body}) {
    id
    title
    body
  }
}`;

const GetEntry = `query($id: ID!) {
	getJournal(id: $id) {
	  id
      title
      body
      createdAt
      updatedAt	
	}
}`;

const ListEntries = `query {
  userJournals(sort:DESC ) {
    items {
      id
      title
      createdAt
    }
  }
}`;

const UpdateTodo = `mutation updateTodo($id: ID!, $note: String, $done: Boolean) {
  updateTodo(input: {id: $id, note: $note, done: $done}) {
    id
    note
    done
  }
}`;

const DeleteTodo = `mutation DeleteTodo($id: ID!) {
  deleteTodo(input: {id: $id}) {
    id
  }
}
`

export {
  CreateEntry,
  ListEntries,
  GetEntry,
  UpdateTodo,
  DeleteTodo
}
