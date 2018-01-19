import React from 'react';
import { render } from 'react-dom';
import { Alert } from 'react-pipestyle';

const App = () => (
  <div style={{padding: 15}}>
    <Alert message="Default alert" />
    <Alert
      type="info"
      message="Info alert"
      onClickClose={() => { }}
    />
    <Alert
      type="warning"
      message="Warning alert"
      onClickClose={() => { }}
    />
    <Alert
      type="danger"
      icon="alert"
      message="Danger alert"
      onClickClose={() => { }}
    />
    <Alert
      big
      message="Big alert"
      onClickClose={() => { }}
    />
  </div>
);

render(<App />, document.getElementById('attachments'));
//ReactDOM.render(<Attachments />, document.getElementById('attachments'));

