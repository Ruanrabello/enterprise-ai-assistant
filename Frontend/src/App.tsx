import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./Auth/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
