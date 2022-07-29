import { Component, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";

import { Switch, Match } from "solid-js";

import type { MatchProps } from "solid-js";
import { For } from "solid-js";

import logo from "./logo.svg";
import styles from "./App.module.css";
import { api } from "./api/api";
import { generateId } from "./utils/idUtil";

const state = {
  list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
  active: "home",
};
const [active, setActive] = createSignal("");
const [userId, setUserId] = createSignal("");
const [email, setEmail] = createSignal("");
const [msg, setMsg] = createSignal("");
const [to, setTo] = createSignal("");
const [list, setList] = createSignal([0]);

const [socket, setSocket] = createSignal<WebSocket>();
const [umail, setUmail] = createSignal("");

const connnectToSocket = (user?: string, id?: string) => {
  const ws = new WebSocket(`ws://${api}/websocket`);

  ws.onopen = () => {
    console.log("Realtime");
    id = id ? id : generateId();
    setUserId(id);
    ws.send(JSON.stringify({ user, id: id }));
  };

  ws.onmessage = (e) => {
    const msg = e.data;
    console.log("Realtime message");
    console.log(msg);
  };

  ws.onclose = (e) => {
    console.log("Realtime reconnecting");
    setTimeout(() => connnectToSocket(), 1000);
  };

  ws.onerror = (err) => {
    console.log(err);
    ws.close();
  };

  return setSocket(ws);
};

onMount(() => {
  setActive(state.active);
  setList(state.list);
});

if (!umail().length && socket())
  // @ts-ignore
  socket().close();

const login = (e: SubmitEvent) => {
  e.preventDefault();
  setUmail(email());
  console.log("connecting realtime");
  if (!socket()) {
    connnectToSocket(umail());
  } else {
    connnectToSocket(umail(), userId());
  }
};

const send = async (e: SubmitEvent) => {
  e.preventDefault();
  const emailData = JSON.stringify({ to: to(), message: msg() });
  await fetch(`http://${api}/webhook/email`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: emailData,
  });
};

const App: Component = () => {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <button onClick={() => setActive("home")} class={styles.actionBtn}>
          <img src={logo} class={styles.logo} alt="logo" />
        </button>
        <h4>WEBHOOK + WEBSOCKET</h4>
        <form onSubmit={login}>
          <input
            type="email"
            name="email"
            id="email"
            class={styles.btn}
            value={email()}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
        </form>
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
