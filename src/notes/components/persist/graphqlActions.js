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
  listJournals(limit:99) {
    items {
      id
      title
      body
      createdAt
      updatedAt
    }
  }
}`;

const ListUserJournals = `query {
	getUserJournals {
	  items {
	  id
      title
      timestamp
      createdAt
      } 	
	}
}`;

const UpdateJournal = `mutation updateJournal($id: ID!, $title: String, $body: String) {
  updateJournal(input: {id: $id, title: $title, body: $body}) {
    id
      title
      body
      createdAt
      updatedAt	
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
  DeleteTodo,
  ListUserJournals
}
