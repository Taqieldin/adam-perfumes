import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store';
import { AppLayout } from '../layouts/AppLayout';
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
        <Toaster position="bottom-right" />
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
