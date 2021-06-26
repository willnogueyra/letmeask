import { BrowserRouter, Route, Switch } from 'react-router-dom'; // yarn add @types/react-router-dom -D para resolver erro de inclusão de types
import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { Room } from './pages/Room';
import { AdminRoom } from './pages/AdminRoom';
import { AuthContextProvider} from  './contexts/AuthContext';
import { ThemeContextProvider } from './contexts/ThemeContext';



function App() {
  return (
    <BrowserRouter>
      <ThemeContextProvider>
        <AuthContextProvider>
          <Switch>
            <Route path="/" exact={true} component={Home} />
            <Route path="/rooms/new" component={NewRoom} />
            <Route path="/rooms/:id" component={Room} />
            <Route path="/admin/rooms/:id" component={AdminRoom} />
          </Switch>
        </AuthContextProvider>
      </ThemeContextProvider>
    </BrowserRouter>
    
  );
}

export default App;
