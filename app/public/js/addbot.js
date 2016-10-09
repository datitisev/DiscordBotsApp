const AddBot = React.createClass({

  getInitialState: function() {
    return {
      name: "",
      description: "",
      directory: ""
    }
  },

  handleNameChange: function(e) {
    this.setState({
      name: e.target.value
    });
  },

  handleDescriptionChange: function(e) {
    this.setState({
      description: e.target.value
    });
  },

  handleFormSubmit: function(e) {
    e.preventDefault();

    let { name, directory, description } = this.state;
    let id = GenerateID();

    if (!name || !directory) return false;

    let projects = App.Settings.GetSync('projects') || [];
    projects.push({
      name, directory, description, id
    });
    App.Settings.Set('projects', projects);
    App.Routes.Load('/');

    return false;
  },

  render: function() {
    return (
      <form action="#" id="AddBot--Form" onSubmit={this.handleFormSubmit}>
        <div className="form-input">
          <div className="form-group">
            <label htmlFor="AddBotForm--Name">
              Bot Name
            </label>
            <input
              className="form-control"
              placeholder="Bot Name"
              type="text"
              id="AddBotForm--Name"
              value={this.state.name}
              onChange={this.handleNameChange} />
          </div>
          <div className="form-group">
            <label htmlFor="AddBotForm--Directory">
              Bot Directory
            </label>
            <input
              className="form-control"
              placeholder="/path/to/bot/directory"
              type="text"
              readOnly
              id="AddBotForm--Directory"
              style={{ display: 'inline-block' }}
              value={this.state.directory} />

              <br/><br/>

              <span className="btn btn-default" onClick={this.chooseDirectory}>Choose Directory</span>
          </div>
          <div className="form-group">
            <label htmlFor="AddBotForm--Description">
              Bot Description
            </label>
            <input
              className="form-control"
              placeholder="Bot Description"
              type="text"
              id="AddBotForm--Description"
              value={this.state.description}
              onChange={this.handleDescriptionChange} />
          </div>
        </div>
        <br/>
        <button className="btn btn-primary form-submit">
          Add Bot
        </button>
      </form>
    );
  },

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
});

ReactDOM.render(
  <AddBot />,
  document.querySelector('#AddBot')
)
