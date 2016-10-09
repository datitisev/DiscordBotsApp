const { spawn, exec } = require('child_process');

class BotView extends React.Component {

  constructor() {
    super();
    this.state = {
      logs: [],
      logsCommand: ''
    };
    this.tailLogs = null;
    this.logs = [];

    this.runLogCommand = this.runLogCommand.bind(this);
    this.handleLogCommandChange = this.handleLogCommandChange.bind(this);
    this.startBot = this.startBot.bind(this);
    this.stopBot = this.stopBot.bind(this);

    this.bot = App.Projects.GetSync(location.search.replace('?id=', ''));

  }

  componentDidMount() {
    if (!this.bot) App.Routes.Load('/');

    remote.getCurrentWindow().onbeforeunload = e => {
      return !!confirm('Are you sure you want to stop the logs?');
    };

    this.setUpLogs();
  }

  getLogs() {
    return this.state.logs;
  }

  render() {
    let bot = this.bot;
    return (
      <div className="Window--BotPage">
        <h2>{this.bot ? this.bot.name : 'Loading...'}</h2>
        <div>
          <Button
            colored
            raised
            ripple
            onClick={ () => App.Routes.Load('/bots/:id/settings', [bot.id])} >
            Settings
          </Button>
          <Button
            colored
            raised
            ripple
            onClick={this.startBot}>
            Start
          </Button>
          <Button
            colored
            raised
            ripple
            onClick={this.stopBot} >
            Stop
          </Button>
        </div>

        <div className="BotPage--Logs" id="shell">
          <div id="main">
            <span className="fore">$ </span>
            <span className="accent"> {bot['settings.logsCommand'] || 'No Command Set Up'}</span>
            <br/>
            <div id="enter">
              <pre>
                {this.getLogs()}
              </pre>
            </div>
          </div>
        </div>
        <form action="#" onSubmit={this.runLogCommand} className="BotPage--LogCommand">
          <input
            type="text"
            className="form-control"
            placeholder="Command"
            value={this.state.logsCommand}
            onChange={this.handleLogCommandChange} />
        </form>
      </div>
    )
  }

  handleLogCommandChange(e) {
    this.setState({
      logsCommand: e.target.value
    });
  }

  runLogCommand(e) {
    e.preventDefault();

    if (!this.state.logsCommand || this.state.logsCommand.length < 2) return false;
    this.tailLogs.stdin.write(this.state.logsCommand + '\n');

    if (this.state.logsCommand == 'exit') this.tailLogs.kill();

    this.setState({
      logsCommand: ''
    });

    return false;
  }

  startBot(e) {
    let startCommand = this.bot['settings.startCommand'];
    let directory = this.bot.directory || _dirname;
    if (!startCommand) return false;

    // TODO: Start Command

    // exec(startCommand, {
    //   cwd: this.bot.directory || __dirname
    // }, (err, stdout, stderr) => {
    //   if (err) return console.error(stderr);
    //   console.log(stdout);
    // });
  }

  stopBot(e) {
    let stopCommand = this.bot['settings.stopCommand'];
    let directory = this.bot.directory || _dirname;
    if (!stopCommand) return false;

    // TODO: Stop Command

    // exec(stopCommand, {
    //   cwd: directory || __dirname
    // }, (err, stdout, stderr) => {
    //   if (err) return console.error(stderr);
    //   console.log(stdout);
    // });
  }

  setUpLogs() {
    let bot = this.bot;
    if (!bot['settings.logsCommand']) bot['settings.logsCommand'] = {
      logsCommand: 'ssh 57c390e80c1e66f2f2000138@discordjsrewritetrello-datitisev.rhcloud.com tail app-root/logs/nodejs.log'
    };
    let execCommand = bot['settings.logsCommand'];
    if (!execCommand) return this.setState({ logs: 'ERROR: No log command found' });

    let command = execCommand.split(' ')[0];
    let args = execCommand.split(' ').splice(1, 999);

    this.tailLogs = spawn(command, args, {
      cwd: bot.directory || __dirname
    });

    this.tailLogs.stdout.on('data', stdout => {
      this.logs.push(stdout.toString());
      this.setState({
        logs: this.logs
      });
    });

    this.tailLogs.stderr.on('data', stderr => {
      this.logs.push(stderr.toString());
      this.setState({
        logs: this.logs
      });
    });

    this.tailLogs.on('close', code => {
      if (code !== 0) {
        this.logs.push('Closed connection.');
      }

      document.querySelector('.BotPage--LogCommand').remove();
    });

    this.tailLogs.on('error', console.log);
  }

}

ReactDOM.render(
  <BotView />,
  document.querySelector('.window-content')
)
