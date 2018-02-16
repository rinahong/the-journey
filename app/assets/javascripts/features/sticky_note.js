
// Helper method to create new node.
function H (tagName, htmlAttrs = {}, ...elements) {
  const newElement = document.createElement(tagName);
  for (let attribute in htmlAttrs) {
    newElement.setAttribute(attribute, htmlAttrs[attribute])
  }
  newElement.append(...elements);

  return newElement;
}

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

  delete(stickyNoteId) {
    const myUrl = `http://localhost:3000/stickynotes/${stickyNoteId}`;
    return fetch(
      myUrl,
      {
        method: 'DELETE',
      }
    )
    .then(res => res.json())
  },

  update(note, index_at, stickyNoteId) {
    const myUrl = `http://localhost:3000/stickynotes/${stickyNoteId}`;
    const dataToUpdate = {
      note: note,
      index_at: index_at
    }
    return fetch (
      myUrl,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToUpdate)
      }
    )
    .then(res => res.json())
  }

} //End Of StickyNote

function renderStickyNotes (allStickyNotes) {
  return allStickyNotes.map(singleNote => {
    return H( 'li',
              {
                'class': 'single-sticky-note sticky-note-box',
                'id': singleNote.id
              },
              H( 'div', null,
                H( 'button', {'class':'delete-button', 'id':singleNote.id}, 'X'),
                H( 'p',
                  {'id':singleNote.id, 'contenteditable':'true'},
                  singleNote.note
                )
              )
    ) // End Of OuterMost H()
  }) // End Of allStickyNotes.map
} // End of renderRoutes()

function sortStickyNoteList() {
  let newPositionIndexAt = null;
  $( ".sticky-note-content-list#sortable" ).sortable({
    cancel: "p,button",
    update: function( event, ui ) {
      let stickyNoteId = ui.item.context.id;
      newPositionIndexAt = ui.item.index();
      console.log("sorting!")
      //Todo: update index
      // StickyNote.updateIndexAt(stickyNoteId, {new_position: newPositionIndexAt}).then((res) => {
      //   reloadStickyNotes()
      //   // res.json()
      // })
    }
 });
}

// Get all sticky notes when reload
function reloadStickyNotes () {
  StickyNote.all()
    .then(allStickyNotes => {
      $('.sticky-note-content-list').empty();
      $('.sticky-note-content-list').append(...renderStickyNotes(allStickyNotes));
      sortStickyNoteList();
    })
}

//Jquery Events Handler
$(document).ready(() => {

  reloadStickyNotes();

  $('.new-sticky-note-icon').on('click', e => {
    let index_at_for_new_note = $('.sticky-note-content-list > li').length;
    // New StickyNote's index will be the one increment of the last list index.
    // Therefore, New StickyNote's index is numOfList's value.
    StickyNote.create("Your Note Here: ", index_at_for_new_note)
      .then(() => reloadStickyNotes());
  });

  $('#note-container').on('keyup', e => {
    let stickynoteId = $(e.target).attr('id');
    let noteDetails = $(e.target).html();
    let stickyNotelistIndex = $( ".sticky-note-content-list > li" ).index($(`#${stickynoteId}`));
    StickyNote.update(noteDetails, stickyNotelistIndex, stickynoteId);
  });

  $('.sticky-note-content-list').on('click','.delete-button', e => {
    let deleteNoteId = $(e.target).attr('id')
    console.log("helloe button clicked", deleteNoteId)
    StickyNote
      .delete(deleteNoteId)
      .then(() => reloadStickyNotes())
  });

}) //End of Document.addEventListener
