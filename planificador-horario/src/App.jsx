import logo from './assets/image/logo.svg';
import styles from './App.module.css'; // ✅ Importación correcta

function App() {
  return (
    <div className={styles.App}> {/* ✅ Notación de objeto */}
      <header className={styles['App-header']}> {/* ✅ Para clases con guión */}
        <img src={logo} className={styles['App-logo']} alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className={styles['App-link']}
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;