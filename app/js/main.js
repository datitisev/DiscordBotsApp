let toolbar_settings = document.querySelector('.toolbar-actions-settings');
let toolbar_bots = document.querySelector('.toolbar-actions-bots');
let loading_spinner = document.querySelector('#loading-spinner');
let ToolbarAction_Close = document.querySelector('.ToolbarTitle--Actions .TitleActions--Close');
let ToolbarAction_Minimize = document.querySelector('.ToolbarTitle--Actions .TitleActions--Minimize');
let ToolbarAction_Maximize = document.querySelector('.ToolbarTitle--Actions .TitleActions--Maximize');

const GenerateID = () => {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return Math.random().toString(36).substr(2, 9);
};
