const window_projects = document.querySelector('.Window--BotList');

class BotList_Bot extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    App.Routes.Load('/bots/:id', [ this.props.id ]);
  }

  render() {
    return (
      <div className="BotList--Bot mdl-card mdl-shadow--2dp">
        <div className="mdl-card__title mdl-card--expand">
          <h2 className="mdl-card__title-text">{this.props.name}</h2>
        </div>
        <div className="mdl-card__supporting-text">
          {this.props.description || "No description"} <br/><br/>
          {this.props.status} <br/>
          <small>{this.props.directory || "Unknown directory"}</small>
        </div>
        <div className="mdl-card__actions mdl-card--border">
          <a className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onClick={this.handleClick}>
            Open
          </a>
        </div>
      </div>
    );
  }
};

class BotList_AddBot extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    App.Routes.Load('/add');
  }

  render() {
    return (
      <div className="BotList--AddBot mdl-card mdl-shadow--2dp" onClick={this.handleClick}>
        <div className="mdl-card__title mdl-card--expand">
          <h1>
            + <br/>
            <small>Add Bot</small>
          </h1>
        </div>
      </div>
    )
  }
};
class BotList_CreateBot extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    App.Routes.Load('/create');
  }

  render() {
    return (
      <div className="BotList--CreateBot mdl-card mdl-shadow--2dp" onClick={this.handleClick}>
        <div className="mdl-card__title mdl-card--expand">
          <h1>
            + <br/>
            <small>Create Bot</small>
          </h1>
        </div>
      </div>
    )
  }
};

class BotList extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    loading_spinner.style = "display: none";
  }

  render() {
    let projects = App.Settings.GetSync('projects');
    let BotNodes = projects ? projects.map(bot => {
      return (
        <BotList_Bot
          name={bot.name}
          description={bot.description}
          status={bot.status}
          directory={bot.directory}
          key={bot.id || Math.random()}
          id={bot.id}>
        </BotList_Bot>
      )
    }) : '';
    return (
      <div className="Window--BotList">
        {BotNodes}
        <BotList_AddBot />
        <BotList_CreateBot />
      </div>
    )
  }
};

ReactDOM.render(
  <BotList />,
  window_projects
);
