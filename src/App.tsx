import { Component, createSignal, onMount } from "solid-js";
import { Switch, Match } from "solid-js";

import type { MatchProps } from "solid-js";
import { For } from "solid-js";

import logo from "./logo.svg";
import styles from "./App.module.css";
import { api } from "./api/api";

const state = {
  list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
  active: "home",
};
const [active, setActive] = createSignal("");
const [email, setEmail] = createSignal("");
const [msg, setMsg] = createSignal("");
const [to, setTo] = createSignal("");
const [list, setList] = createSignal([0]);

const [socket, setSocket] = createSignal(
  new WebSocket(`ws://${api}/websocket`)
);

const connnectToSocket = () => {
  const ws = new WebSocket(`ws://${api}/websocket`);

  ws.onopen = () => {
    ws.send(JSON.stringify({ mail: "hello" }));
  };

  ws.onmessage = (e) => {
    const msg = e.data;
    console.log(msg);
  };

  ws.onclose = (e) => {
    console.log("Realtime reconnecting");
    setTimeout(() => connnectToSocket(), 1000);
  };

  ws.onerror = (err) => {
    console.log("Realtime error");
    ws.close();
  };

  return setSocket(ws);
};

onMount(() => {
  setActive(state.active);
  setList(state.list);
  connnectToSocket();
});

const App: Component = () => {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <button onClick={() => setActive("home")} class={styles.actionBtn}>
          <img src={logo} class={styles.logo} alt="logo" />
        </button>
        <h4>WEBHOOK + WEBSOCKET</h4>
        <input type="email" name="email" id="email" />
        <button
          onClick={() => setActive("notifications")}
          class={styles.actionBtn}
        >
          <small style="color:white; text-decoration:none">Notifications</small>
        </button>
      </header>
      <main class={styles.main}>
        <div class={styles.mainBtnContainer}>
          <button class={styles.btn}>SEND MAIL</button>
          <button class={styles.btn}>SEND BEEP</button>
        </div>
        {/* routing */}
        <Switch fallback={<div>Not Found</div>}>
          <Match when={active() === "home"}>home page</Match>

          <Match when={active() === "notifications"}>
            {/* notifications */}
            <section class={styles.listContainer}>
              <For each={list()} fallback={<div>Loading...</div>}>
                {(item) => <div>{item}</div>}
              </For>
            </section>
          </Match>
        </Switch>
      </main>
    </div>
  );
};

export default App;
