import Game from "./components/Game";

function App() {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="hero rounded-xl h-2/3 w-1/2 bg-base-200">
        <Game />
      </div>
    </div>
  );
}

export default App;
