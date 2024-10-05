import "./styles.css";

export default function Home() {
  const s = require('./styles.css');
  return (
    
    <body>
      <img className="styles.img" src="https://s3-alpha-sig.figma.com/img/f3ea/7727/b0214f1847e502d3f5b55db828555be1?Expires=1728864000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=GGkdkTTSdy6dBxrXKzmb6jwpRIotYMNZFViUt9NwL0pqe~sYnPe2Zy5SullefV-TW~YBunnJDhFvVQtR4GYGhaDQTJ5a5ASSluuPBrzF1zUspUwSZohRkvKK1-NRy1TOusKRcEyUOmSAki0Sm3qRw58Uc7d5sE1bCpW-gzl5e5FEB~t4WnSU8UQ5mIeBTZuRCuEHz-IC~V8RXw3T9qL9Nq1TBzZzOmlPnyuwxCNUUz41STPad-lXVkP~xXxKw~rSdQzkZ6PEhwj0e2YWkROhI4jpKlHwpMANodP~VLNOHI6QP3cfi-TTyU4P-u-OPHqHtRozRLCivt9z9z4gj7QNCA__"></img>
      <div>
        <header className="w-screen absolute">
          <h2>AgroSpace</h2>
          <button>Sign in</button>
        </header>
        <div className="heading w-screen"></div>
        <div className="tittle-text">
        <h1 className="styles.tittle">The earth speaks - AgroSpace listens and reacts instantly!</h1>
        <p className="subtittle">Increase your yield with one click using smart technologies for precise field management.</p>
        </div>
      </div>
    </body>
  );
}
