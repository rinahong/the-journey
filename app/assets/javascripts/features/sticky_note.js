// Ajax for StickyNote Object: create, all, delete
const StickyNote = {
  create(note, index_at) {
    const routeid = $('#route-show').data('routeid');
    const myUrl = `http://localhost:3000/routes/${routeid}/stickynotes`;
    const dataToSend = {
      note: note,
      index_at: index_at
    }

    return fetch(
      myUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      }
    )
    .then(res => res.json())
  },

  all() {
    const routeid = $('#route-show').data('routeid');
    const myUrl = `http://localhost:3000/routes/${routeid}/stickynotes`;
    return fetch(myUrl)
       .then(res => res.json())
  },

  delete(stickynoteId) {
    const myUrl = `http://localhost:3000/stickynotes/${stickynoteId}`;
    return fetch(
      myUrl,
      {
        method: 'DELETE',
      }
    )
    .then(res => res.json())
  }
} //End Of StickyNote
