function App() {
  return (
    <div className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">THE COMMUNITY BULLETIN</p>
          <h1>noticeboard</h1>
        </div>

        <div className="account">
          <button className="login">log in</button>
          <button className="signup">sign up</button>
        </div>
      </header>

      <main className="board">
        <div className="board-header">
          <div>
            <p className="small-label">COMMUNITY BOARD</p>
            <h2>what's happening?</h2>
          </div>

          <div className="board-note">
            <span>REMINDER</span>
            <p>if you missed it, scroll back.</p>
          </div>
        </div>

        <div className="tape tape-one" />
        <div className="tape tape-two" />

        <section className="posts">
          <article className="post paper pink-paper">
            <span className="push-pin pink-pin" />
            <p className="post-type">ANNOUNCEMENT</p>
            <h3>Welcome to the noticeboard</h3>
            <p>
              This is where the important things, tiny things, and
              mildly chaotic things get pinned.
            </p>
            <div className="scribble">— admin</div>
          </article>

          <article className="post notebook">
            <span className="staple" />
            <p className="post-type">REMINDER</p>
            <h3>Workshop this Saturday</h3>
            <p>
              Don't forget to bring your notebook. More details are
              pinned below.
            </p>
            <div className="notebook-line" />
            <div className="notebook-line" />
            <div className="notebook-line" />
          </article>

          <article className="post flyer">
            <div className="flyer-tape" />
            <p className="flyer-small">IMPORTANT / PLEASE READ</p>
            <h3>TRIP<br />PLANNING</h3>
            <div className="flyer-rule" />
            <p>
              Three people are handling the main planning.
              Everyone else can vote and add their thoughts.
            </p>
            <strong>MORE INFO →</strong>
          </article>

          <article className="post yellow-paper">
            <span className="push-pin yellow-pin" />
            <p className="post-type">UPDATE</p>
            <h3>tiny update</h3>
            <p>
              The thing we were waiting for finally happened.
              More details soon.
            </p>
          </article>

          <article className="post green-paper">
            <div className="washi" />
            <p className="post-type">CASUAL NOTE</p>
            <h3>hey btw</h3>
            <p>
              Someone left their water bottle in the common room.
              It's been adopted by the noticeboard now.
            </p>
            <div className="handwritten">please claim me</div>
          </article>

          <article className="post checkered-card">
            <span className="push-pin green-pin" />
            <p className="post-type">COMING UP</p>
            <h3>save the date</h3>
            <p>
              A little something is happening soon.
              Keep an eye on the board.
            </p>
            <div className="date-box">SAT / 24</div>
          </article>
        </section>
      </main>

      <footer>
        <p>nothing fancy. just a place to put things.</p>
      </footer>
    </div>
  );
}

export default App;