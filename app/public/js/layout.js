// LAYOUT COMPONENTS
class Header extends React.Component {
  constructor() {
    super();
    // this.CloseWindow = this.CloseWindow.bind(this);
    // this.MinimizeWindow = this.MinifyWindow.bind(this);
    // this.MaximizeWindow = this.MaximizeWindow.bind(this);
  }

  componentDidMount() {
    loading_spinner.style = 'display: none';
  }

  render() {
    return (
      <div className="toolbar toolbar-header">
        <div className="ToolbarTitle--Actions">
          <span className="TitleActions TitleActions--Close" onClick={this.CloseWindow}></span>
          <span className="TitleActions TitleActions--Minimize" onClick={this.MinimizeWindow}></span>
          <span className="TitleActions TitleActions--Maximize" onClick={this.MaximizeWindow}></span>
        </div>
        <div className="title">
          Discord Bots Interface
        </div>
        <div className="toolbar-actions">
          <button className="btn btn-default toolbar-actions-bots" onClick={() => App.Routes.Load('/')}>
            <span className="icon icon-text icon-home"></span>
            Bots
          </button>
          <button className="btn btn-default toolbar-actions-settings" onClick={() => App.Routes.Load('/settings')}>
            <span className="icon icon-text icon-cog"></span>
            Settings
          </button>
        </div>
      </div>
    )
  }


  CloseWindow() {
    remote.getCurrentWindow().close();
  }

  MinimizeWindow() {
    remote.getCurrentWindow().minimize();
  }

  MaximizeWindow() {
    let window = remote.getCurrentWindow();
    if (!window.isMaximized()) {
      window.maximize();
    } else {
      window.unmaximize();
    }
  }
}

ReactDOM.render(
  <Header />,
  document.querySelector('.window > header')
)
