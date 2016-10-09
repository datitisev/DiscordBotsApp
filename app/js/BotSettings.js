class BotSettings extends React.Component {
  constructor() {
    super();

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleLogsCommandChange = this.handleLogsCommandChange.bind(this);
    this.handleStartCommandChange = this.handleStartCommandChange.bind(this);
    this.handleStopCommandChange = this.handleStopCommandChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);

    this.bot = App.Projects.GetSync(location.search.replace('?id=', ''));
    this.state = this.bot;

    if (!this.bot) return App.Routes.Load('/');
  }

  componentDidMount() {
    if (!this.bot) App.Routes.Load('/');
  }

  render() {
    let bot = this.bot;

    return (
      <div className="Window--BotSettings">
        <h2>{this.state.name}</h2>
        <form action="#" id="BotSettings--Form" onSubmit={this.handleFormSubmit}>
          <h4>Info</h4>
          <Grid>
            <Cell col={4}>
              <Textfield
              onChange={this.handleNameChange}
              value={this.state.name}
              label="Bot Name"
              floatingLabel />
            </Cell>

            <Cell col={4}>
              <Textfield
                readOnly
                onClick={this.chooseDirectory}
                value={this.state.directory}
                label="Bot Directory"
                floatingLabel />
            </Cell>

            <Cell col={4}>
              <Textfield
                onChange={this.handleDescriptionChange}
                value={this.state.description}
                label="Bot Description"
                floatingLabel />
            </Cell>
          </Grid>

          <h4>Commands</h4>
          <Textfield
            type="text"
            onChange={this.handleStartCommandChange}
            value={this.state['settings.startCommand']}
            label="Start Command"
            floatingLabel />

          <br/>

          <Textfield
            type="text"
            onChange={this.handleStopCommandChange}
            value={this.state['settings.stopCommand']}
            label="Stop Command"
            floatingLabel />

          <br/>

          <Textfield
            type="text"
            onChange={this.handleLogsCommandChange}
            value={this.state['settings.logsCommand']}
            label="Logs Command"
            floatingLabel />

          <br/>

          <Button
            primary
            raised
            ripple >
            Save
          </Button>
          &nbsp;
          <Button
            primary
            raised
            ripple
            onClick={(e) => {
              e.preventDefault();
              App.Routes.Load('/bots/:id', [bot.id]);
              return false;
            }} >
            Back
          </Button>
        </form>
      </div>
    )
  }

  handleNameChange(e) {
    this.setState({
      name: e.target.value
    });
  }

  handleDescriptionChange(e) {
    this.setState({
      description: e.target.value
    });
  }

  handleLogsCommandChange(e) {
    this.setState({
      'settings.logsCommand': e.target.value
    });
  }

  handleStartCommandChange(e) {
    this.setState({
      'settings.startCommand': e.target.value
    });
  }

  handleStopCommandChange(e) {
    this.setState({
      'settings.stopCommand': e.target.value
    });
  }

  chooseDirectory(e) {
    e.preventDefault();

    ipc.send('AddBot/OpenFileDialog');
    ipc.once('AddBot/ReceiveDirectory', (event, path) => {
      if (path && path[0]) this.setState({
        directory: path[0]
      });
    });

    return false;
  }

  handleFormSubmit(e) {
    e.preventDefault();

    let newBot = this.state;

    if (!newBot.name || !newBot.directory) return false;

    let projects = App.Projects.GetSync(newBot.id);

    App.Projects.Set(newBot.id, newBot);

    // App.Routes.Refresh();

    return false;
  }
}

ReactDOM.render(
  <BotSettings />,
  document.querySelector('.window-content')
)
