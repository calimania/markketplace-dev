import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

import { StrapiClient } from './api/api.strapi';


function App() {
  const [store, setStore] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const client = new StrapiClient();
      const result = await client.getStore();
      const store = result?.data?.[0]
      setStore(store);
    }

    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {store ? store.title : 'Loading...'}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
