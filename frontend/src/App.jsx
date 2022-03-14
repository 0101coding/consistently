import Footer from "./components/Footer";
import Greeter from "./components/Greeter";
import Navbar from "./components/Navbar";
import { GreeterProvider } from "./context/GreeterContext";
import { WalletProvider } from "./context/WalletContext";


import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <div className="main">
      <WalletProvider>
        <div className="container">
          <Navbar />
          <div>
            <GreeterProvider>
              <Greeter />
            </GreeterProvider>
          </div>
          <Footer />
        </div>
      </WalletProvider>
    </div>
  );
}

export default App;
