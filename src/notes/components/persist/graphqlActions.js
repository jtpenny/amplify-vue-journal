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

const UpdateEntry = `mutation updateJournal($id: ID!, $title: String, $body: String) {
  updateJournal(input: {id: $id, title: $title, body: $body}) {
    id
    title
    body
    createdAt
    updatedAt	
  }
}`;

const DeleteEntry = `mutation deleteJournal($id: ID!) {
  deleteJournal(input: {id: $id}) {
    id
  }
}
`

export {
  CreateEntry,
  ListEntries,
  GetEntry,
  UpdateEntry,
  DeleteEntry
}
