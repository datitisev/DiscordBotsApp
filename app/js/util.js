const electron = require('electron');
const remote = electron.remote;
const ipc = electron.ipcRenderer;
const settings = require('electron-settings');
const { Badge, Button, FABButton, Card, CardTitle, CardText, Checkbox, DataTable, TableHeader, Grid, Cell, IconButton, Menu, Menuitem, ProgressBar, List, ListItem, RadioGroup, Radio, Snackbar, Spinner, Switch, Tabs, Tab, Textfield, Tooltip, Icon } = require('react-mdl')

const LoadURL = data => {
  let url = data.includes('http://') || data.includes('file://') ? data : `file://${__dirname}/${data}.html`;

  ipc.send('view/load', url);
};

class Settings {
  constructor() {
    this._settings = settings.getSync();
  }

  Get(setting, cb) {
    return settings.get(setting).then(val => {
      if (cb) cb(val);
      return val;
    });
  }

  GetSync(setting) {
    return settings.getSync(setting);
  }

  Set(setting, value, cb) {
    return settings.set(setting, value).then(val => {
      if (cb) cb(val);
      this._settings[setting] = val;
      return val;
    });
  }

  Delete(setting, cb) {
    return settings.delete(setting).then(()  => {
      if (cb) cb();
      delete this._settings[setting];
    });
  }

  Clear(cb) {
    return settings.clear().then(() => {
      if (cb) cb();
      this._settings = {};
    });
  }
}
class Bot {
  constructor(opts = {}) {
    this.id = opts.id || '';
    this.description = opts.description || '';
    this.directory = opts.directory || '';
    this.name = opts.name || '';

    this['settings.startCommand'] = opts['settings.startCommand'] || '';
    this['settings.stopCommand'] = opts['settings.stopCommand'] || '';
    this['settings.logsCommand'] = opts['settings.logsCommand'] || '';
  }
}
class Projects {
  constructor() {
    this._projects = settings.getSync('projects').map(e => new Bot(e));;
  }
  Get(id) {
    return Promise.resolve(this.GetSync(id));
  }
  GetSync(id) {
    if (!id) return this._projects;
    return this._projects.filter(e => e.id == id)[0];
  }
  Set(id, data) {
    return new Promise((resolve, reject) => {
      let originalProject = this.GetSync(id) || {};
      let projectIndex = this._projects.indexOf(originalProject);
      let newProject = originalProject;

      Object.keys(data).forEach(key => {
        let value = data[key];
        newProject[key] = value;
      });

      if (!newProject) return false;

      this._projects[projectIndex] = new Bot(newProject);

      this.Save();

      resolve(newProject);
    });
  }

  Save() {
    return settings.set('projects', this._projects);
  }
}
class Router extends Map {

  constructor(opts) {
    super(opts);
  }

  Add(path, data) {
    if (typeof data == 'object') {
      data.file = `file://${__dirname}/${data.file}`;
    } else {
      data = data.includes('http') ? data : `file://${__dirname}/${data}`;
    }
    this.set(path, data);
  }

  Load(path, params) {
    let url = this.get(path);
    if (!url) throw new Error(`No route in ${path} has been configured!`);

    if (typeof url == 'object') {
      let querys = [];
      url.params.forEach((param, i) => {
        querys.push(`${param}=${params[i]}`);
      });
      url = `${url.file}?${querys}`;

      LoadURL(url);
    } else LoadURL(url);
  }

  Refresh() {
    document.location.reload();
  }

}

class WebApp {
  constructor() {
    this._settings = new Settings();
    this._routes = new Router();
    this._projects = new Projects();
  }

  get Settings() {
    return this._settings;
  }

  get Routes() {
    return this._routes;
  }

  get Projects() {
    return this._projects;
  }
}

const App = new WebApp();

App.Routes.Add('/', 'index.html');
App.Routes.Add('/settings', 'settings.html');
App.Routes.Add('/add', 'AddBot.html');
App.Routes.Add('/bots/:id', {
  file: 'BotView.html',
  params: ['id'],
  query: 'id'
});
App.Routes.Add('/bots/:id/settings', {
  file: 'BotSettings.html',
  params: ['id'],
  query: 'id'
});

// A bot with Trello events for the DiscordJS Rewrite board :D
