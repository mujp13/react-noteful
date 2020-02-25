import React, { Component } from 'react';
import NotefulContext from './NotefulContext';
import './NotePage.css';

function deleteNoteRequest(noteId, cb) {
  fetch(`http://localhost:9090/notes/${noteId}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(res => {
      if (!res.ok) {
        // get the error message from the response,
        return res.json().then(error => {
          // then throw it
          throw error;
        });
      }
      return res.json();
    })
    .then(data => {
      // call the callback when the request is successful
      // this is where the App component can remove it from state
      console.log({ data });
      cb(noteId);
    })
    .catch(error => {
      console.error(error);
    });
}

export default class NotePage extends Component {
  static contextType = NotefulContext;

  render() {
    const note = this.context.notes.find(p => p.id === this.props.match.params.noteId);

    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const dateTime = date + ' ' + time;

    return (
      <NotefulContext.Consumer>
        {context => (
          <div className="note-content">
            <div className="note-header">
              <h2>{note.name}</h2>
                <div className="sub-content">
                  {note.modified ? <p>Date modified on {note.modified}</p> : <p>Date modified on {dateTime}</p>}
                  <button
                    className="delete-button"
                    onClick={() => {
                      deleteNoteRequest(note.id, context.deleteNote);
                      this.props.history.push('/');
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            <div className="note-desc">
              <p>{note.content}</p>
            </div>
          </div>
        )}
      </NotefulContext.Consumer>
    );
  }
}
