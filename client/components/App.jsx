import React from 'react';

// Импортируем store в наш компонент (начало работы с Flux)
import NotesStore from '../stores/NotesStore';
import NotesActions from '../actions/NotesActions';

import NoteEditor from './NoteEditor.jsx';
import NotesGrid from './NotesGrid.jsx';

import './App.less';

// Flux::Данная функция будет вызываться каждый раз, когда будут происходить
// какие-либо изменения в Store, т.е. когда будет происходить emitChange
function getStateFromFlux() {
    return {
        isLoading: NotesStore.isLoading(),
        notes: NotesStore.getNotes()
    };
}

const App = React.createClass({
  // Flux::В методе getInitialState() нам нужно получить состояние из Flux
  // Вызываем метод getStateFromFlux() который будет лежать в нашем состоянии
  getInitialState() {
      return getStateFromFlux();
  },

  // Загружаем все заметки, которые вернет нам API. Обращаемся к Actions
  componentWillMount() {
      NotesActions.loadNotes();
  },

  // Подписка на изменения в Store. Добавляем слушателя на изменения в NotesStore
  componentDidMount() {
      NotesStore.addChangeListener(this._onChange);
  },

  // Отписка на изменения в Store, если компонент уже будет Unmount-ится. Удаляем слушателя
  componentWillUnmount() {
      NotesStore.removeChangeListener(this._onChange);
  },

  // Удаляем заметку. Обращаемся к Actions
  handleNoteDelete(note) {
      NotesActions.deleteNote(note.id);
  },

  // Создаём новую заметку. Обращаемся к Actions
  // createNote(data) - передаем данные полученные из нашего редактора
  handleNoteAdd(data) {
    // console.log(data);
    NotesActions.createNote(data);
  },

  render() {
    return (
      <div className='App'>
        <h2 className='App__header'>NotesApp</h2>
        <NoteEditor onNoteAdd={this.handleNoteAdd} />
        <NotesGrid notes={this.state.notes} onNoteDelete={this.handleNoteDelete} />
      </div>
    );
  },

  // Определяем метод onChange, который будет вызваться каждый раз когда в Store будут происходить изменения
  _onChange() {
      this.setState(getStateFromFlux());
  }
});

export default App;
