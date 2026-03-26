import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider, DataProvider } from './context/AppContext';
import { AllAuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <AllAuthProvider>
      <AuthProvider>
        <DataProvider>
          <RouterProvider router={router} />
          <Toaster />
        </DataProvider>
      </AuthProvider>
    </AllAuthProvider>
  );
}
