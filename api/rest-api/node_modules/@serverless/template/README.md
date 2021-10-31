# Template

This component is used behind the scenes to deploy your YAML templates. It is loaded by the serverless CLI and executed just as any other component.
However, there's a lot you can do with this component programmatically. See the sections below for some examples.

### Programmatic usage and custom environments

To deploy to multiple environments you must utilize the programmatic API, via `serverless.js` file.

`serverless.js`

```js
const { Component } = require('@serverless/core')

class Deploy extends Component {
  async default(inputs = {}) {
    const { env } = inputs

    const template = await this.load('@serverless/template', env)
    return await template({ template: __dirname + '/serverless.yml' })
  }

  async remove(inputs = {}) {
    const { env } = inputs

    const template = await this.load('@serverless/template', env)
    await template.remove(inputs)
  }
}

module.exports = Deploy
```

`serverless.yml`

```yml
name: test

lambda:
  component: '@serverless/function'
  inputs:
    name: my-function
    description: My Serverless Function
    memory: 128
    timeout: 20
    code: './code'
    hanlder": 'handler.handler'
    region: us-east-1
    runtime: nodejs10.x
```

Invoking `sls --env=dev` will result in state files in `.serverless/` being prefixed with the value of your `env`:
`Deploy.dev.json`, etc. That way you can deploy unlimited environments, add pre/post processing, load whatever `.env` you need, etc.

### Running custom methods on a template

A template itself does not contain any methods so custom methods are executed on the specific template aliases.

`sls install --component lambda` will load the `lambda` alias from your template, instantiate the corresponding component, and execute the `install` method passing in the inputs you specify via CLI parameters.
Inputs from the template itself are not passed as they can not be interpreted/resolved without running the entire template.

You can pass as many `--component` parameters as you need.

### Running custom methods programmatically

`serverless.js`

```js
const { Component } = require('@serverless/core')

class Deploy extends Component {
  /* ...skipped default method for brevity ... */

  async install(inputs = {}) {
    const template = await this.load('@serverless/template')
    await template.install({ template: __dirname + '/serverless.yml', ...inputs })
  }
}

module.exports = Deploy
```

When invoking methods on a `template` instance, you always need to pass in a path to the template file or a template object.

Running `sls install --component lambda --debug` - this will load the template, find the `lambda` alias, and invoke the `install` method on the instance of the component.

### Couldn't find what you were looking for?

Visit our github and file an issue with as much info as possible about your problem.
If you think you've found a bug - please do post a complete reproduction repo. It will help us and our contributors to help you much faster.
