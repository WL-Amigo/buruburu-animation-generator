/* @refresh reload */
import { render } from 'solid-js/web';

import 'virtual:windi.css';
import './index.css';
import App from './App';
import { AppViewModelContextProvider } from './viewModels';
import { Bootstrap } from './bootstrap';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mispelled?'
  );
}

render(
  () => (
    <Bootstrap>
      {(initStates) => (
        <AppViewModelContextProvider initStates={initStates}>
          <App />
        </AppViewModelContextProvider>
      )}
    </Bootstrap>
  ),
  root!
);
