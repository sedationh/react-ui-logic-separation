import { useReducer, useRef } from "react";

type A = ReturnType<Core["getProps"]>;

class Core {
  updater: () => void;

  constructor(updater: () => void) {
    this.updater = updater;
  }

  state = {
    title: "Hello World",
    age: 1,
  };

  setState = (state: Partial<Core["state"]>) => {
    this.state = {
      ...this.state,
      ...state,
    };
    this.updater();
  };

  getComputed = () => {
    const titleWith666 = () => this.state.title + "666";
    const titleWith666And777 = () => titleWith666() + "777";

    return {
      titleWith666: titleWith666(),
      titleWith666And777: titleWith666And777(),
    };
  };

  updateTitle = (newTitle = "newTitle") => {
    this.setState({
      title: newTitle,
    });
  };

  getProps = () => {
    return {
      state: this.state,
      methods: {
        updateTitle: this.updateTitle,
      },
      computed: this.getComputed(),
    };
  };
}

function UI({ state, methods, computed }: A) {
  return (
    <div>
      <h2>state</h2>
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <h2>computed</h2>
      <pre>{JSON.stringify(computed, null, 2)}</pre>
      <button onClick={() => methods.updateTitle(state.title + "1")}>
        Update Title
      </button>
    </div>
  );
}

function withCore<P extends A>(WrappedComponent: React.ComponentType<P>) {
  return function WithCore(props: Omit<P, keyof A>) {
    const coreRef = useRef<Core | null>(null);
    const [, forceUpdate] = useReducer((c) => c + 1, 0);

    if (coreRef.current === null) {
      coreRef.current = new Core(forceUpdate);
    }

    const coreProps = coreRef.current.getProps();

    return <WrappedComponent {...(props as P)} {...coreProps} />;
  };
}

const UIWithCore = withCore(UI);

function App() {
  return (
    <div>
      <UIWithCore />
    </div>
  );
}

export default App;
