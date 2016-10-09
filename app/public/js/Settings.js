class Settings extends React.Component {
  constructor() {
    super();

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleAutoUpdateChange = this.handleAutoUpdateChange.bind(this);

    this.state = {
      autoUpdate: App.Settings.GetSync('autoUpdate') !== undefined ? App.Settings.GetSync('autoUpdate') : true
    }
  }

  handleFormSubmit(e) {
    e.preventDefault();

    App.Settings.Set('autoUpdate', this.state.autoUpdate == "true").then(App.Routes.Refresh)
  }

  handleAutoUpdateChange(e) {
    this.setState({
      autoUpdate: e.target.value
    })
  }

  render() {
    return (
      <div className="Window--Settings">
        <h1>Settings</h1>
        <form
          onSubmit={this.handleFormSubmit}>
          <Textfield
            type="text"
            onChange={this.handleAutoUpdateChange}
            value={this.state.autoUpdate}
            label="Auto Update (true or false)"
            floatingLabel />

          <br/>
          <br/>

          <Button
            primary
            raised
            ripple >
            Save
          </Button>
        </form>
      </div>
    )
  }
}

ReactDOM.render(
  <Settings />,
  document.querySelector('.window-content')
)
