import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import FolderList from './FolderList';
import NotesPage from './NotesPage';
import NotePage from './NotePage';
import NotePageNav from './NotePageNav';
import AddFolder from './AddFolder';
import AddNote from './AddNote';
import './App.css';
import NotefulContext from './NotefulContext';
import NotefulError from './NotefulError'

class App extends Component {
  state = {
    error: null,
    folderIsLoaded: false,
    noteIsLoaded: false,
    folders: [],
    notes: []
  };

  addFolder = folder => {
    this.setState({
      folders: [ ...this.state.folders, folder ]
    })
  }

  addNote = note => {
    this.setState({
      notes: [ ...this.state.notes, note ]
    })
  }

  deleteNote = noteId => {
    const newNotes = this.state.notes.filter(note => note.id !== noteId);
    this.setState({
      notes: newNotes
    });
  };

  componentDidMount() {
    fetch('http://localhost:9090/folders', {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            folderIsLoaded: true,
            folders: result
          });
        },
        error => {
          this.setState({
            folderIsLoaded: false,
            error
          });
        }
      );

    fetch('http://localhost:9090/notes')
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            noteIsLoaded: true,
            notes: result
          });
        },

        error => {
          this.setState({
            noteIsLoaded: false,
            error
          });
        }
      );
  }

  deleteNote = noteId => {
    const newNotes = this.state.notes.filter(note => note.id !== noteId);
    this.setState({
      notes: newNotes
    });
  };

  render() {
    const contextValue = {
      folders: this.state.folders,
      notes: this.state.notes,
      deleteNote: this.deleteNote,
      addFolder: this.addFolder,
      addNote: this.addNote
    };

    return (
      <main className="App">
        <NotefulError>
          <nav>
            <Link to="/" style={{ textDecoration: 'none' }}>
              Noteful
            </Link>
          </nav>
          <NotefulContext.Provider value={contextValue}>
            <section className="bottom">
              <aside>
                <Route exact path="/" component={FolderList} />
                <Route exact path="/folder/:folderId" component={FolderList} />
                <Route path="/note/:noteId" component={NotePageNav} />
                <Route path="/add-folder" component={AddFolder} />
              </aside>
              <main>
                <Route exact path="/" component={NotesPage} />
                <Route path="/note/:noteId" component={NotePage} />
                <Route path="/folder/:folderId" component={NotesPage} />
                <Route path="/add-note" component={AddNote} />
              </main>
            </section>
          </NotefulContext.Provider>
        </NotefulError>
      </main>
    );
  }
}

export default App;
