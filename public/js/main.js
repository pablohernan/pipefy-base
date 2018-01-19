import React from 'react';
import { render } from 'react-dom';
import { Dropdown } from 'react-pipestyle';

const App = () => (
  <div>
    <Dropdown
      hasHeader
      inputLabel="Dropdown medium"
      inputPlaceholder="Field placeholder"
      inputOnChange={() => { }}
      inputTabIndex={1}
      inputTitle="Field title"
      hasFooter
      buttonTitle="Button title"
      buttonLabel="Click here"
      buttonTabIndex={1}
      buttonOnClick={() => { }}
    >
      Content
    </Dropdown>
    <hr />
    <Dropdown
      hasHeader
      inputLabel="Dropdown large"
      size="lg"
    >
      Content
    </Dropdown>
    <hr />
    <Dropdown>
      Content
    </Dropdown>
  </div>
);

render(<App />, document.getElementById('attachments'));
