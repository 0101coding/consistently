import Footer from "./components/Footer";
import Header from "./components/Header";
import { WalletProvider } from "./context/WalletContext";

function App() {
  return (
    <div className="main">
      <WalletProvider>
        <div className="container">
          <Header />
          <div>
            <h1>Home Page</h1>
          </div>
          <Footer />
        </div>
      </WalletProvider>
    </div>
  );
}

export default App;
