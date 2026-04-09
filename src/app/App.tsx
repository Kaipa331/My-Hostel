import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { DataProvider } from './context/AppContext';
import { AllAuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <AllAuthProvider>
      <DataProvider>
        <RouterProvider router={router} />
        <Toaster />
      </DataProvider>
    </AllAuthProvider>
  );
}
