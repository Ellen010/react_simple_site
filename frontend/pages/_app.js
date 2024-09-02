import '../styles/globals.css';
import Head from 'next/head';
import Header from '../components/Header';

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import bookmarks from '../reducers/bookmarks';
import user from '../reducers/user';

const store = configureStore({
  reducer: { bookmarks, user },
});

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Head>
        <title>Morning News</title>
      </Head>
      <Header />
      <Component {...pageProps} />
    </Provider>
  );
}

export default App;
