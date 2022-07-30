import * as React from 'react';
import type { Author } from './lib/Author';
import AuthorContext from './lib/AuthorContext';
import AuthorStatistics from './components/AuthorStatistics';

import './style.css';

const SearchAuthor = () => {
  const { setAuthor } = React.useContext(AuthorContext);
  const [authorId, setAuthorId] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSearch = async (evt: React.FormEvent) => {
    evt.preventDefault();

    let errors = validateId();

    if (errors) {
      setError(errors);
      return;
    } else setError('');

    try {
      let response = await fetch(
        `https://api.openalex.org/authors/${authorId}`
      );

      if (response.status != 200) {
        setError(response.statusText);
        return;
      }

      let data: Author = await response.json();

      setAuthor(data);
    } catch (e) {
      console.error(e);
      setError('There was an error with your request.');
    }
  };

  /**
   * Performs validation on the Author Id before it is fetched.
   */
  const validateId = (): string => {
    if (!authorId) return 'Enter an author ID!';
    if (!authorId.toUpperCase().startsWith('A'))
      return "Author IDs start with 'A'!";
  };

  const handleInput = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setAuthorId(evt.target.value);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <p className="formError">{error}</p>
        <label htmlFor="openID">Enter an author ID: </label>
        <input id="openID" type="text" onChange={handleInput} />
        <button id="formSubmit" type="submit">
          Search
        </button>
      </form>
    </div>
  );
};

export default function App() {
  const [author, setAuthor] = React.useState<Author | null>(null);
  return (
    <div>
      <AuthorContext.Provider value={{ author, setAuthor }}>
        <div className="header">
          <div>
            <h1>OpenAlex App</h1>
          </div>
          <SearchAuthor />
          <AuthorStatistics />
        </div>
      </AuthorContext.Provider>
    </div>
  );
}
