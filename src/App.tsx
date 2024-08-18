import { useReducer, useRef } from "react";

type A = ReturnType<Core["getProps"]>;

class Core {
  updater: () => void;

  constructor(updater) {
    this.updater = updater;
  }

  state = {
    title: "Hello World",
  };

  updateTitle = (newTitle = "newTitle") => {
    this.state.title = newTitle;
    this.updater();
  };

  getProps = () => {
    return {
      state: this.state,
      methods: {
        updateTitle: this.updateTitle,
      },
    };
  };
}

function UI({ state, methods }: A) {
  return (
    <div>
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <button onClick={() => methods.updateTitle(state.title + "1")}>
        Update Title
      </button>
    </div>
  );
}

function App() {
  const coreRef = useRef<Core>(null);

  const [, forceUpdate] = useReducer((c) => c + 1, 0);

  if (coreRef.current === null) {
    coreRef.current = new Core(forceUpdate);
  }

  return (
    <div>
      <h1>UI</h1>
      <UI {...coreRef.current.getProps()} />
    </div>
  );
}

export default App;
