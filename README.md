## Serverless YAML extension parser 
[![CircleCI](https://circleci.com/gh/01alchemist/sls-yaml/tree/master.svg?style=svg)](https://circleci.com/gh/01alchemist/sls-yaml/tree/master)

This tiny library will parse YAML extensions used in serverless framework.

### Supported extensions
- [Include external file](#include-external-file) `${file(path/to/file.yml)}`
- [Inject environment variable](#inject-environment-variable) `${env:NODE_ENV}`
- [Inject global variables](#inject-global-variables) `${global:path.to.variable}`
- [Inject local variables](#inject-local-variables) `${self:path.to.variable}`

### Include external file
This extension will include content of external yaml files.

- config.yml
```yaml 
version : 1
env: dev
config: ${file(./common.yml)}
```

- common.yml
```yaml
endpoint: http://service-url
```

- Generated final yaml
```yaml
version : 1
env: dev
config: 
  endpoint: http://service-url
```


### Inject environment variable
This extension will inject envronment values

- config.yml `export NODE_ENV = development`
```yaml 
version : 1
env: ${env:NODE_ENV}
```

- Generated final yaml
```yaml 
version : 1
env: development
```

### Inject global variables
This extension will inject variable from global scope.

- config.yml
```yaml 
version : 1
env: stage
config: ${file(./common.yml)}
```

- common.yml
```yaml
endpoint: http://service-${global:env}
```

- Generated final yaml
```yaml
version : 1
env: stage
config: 
  endpoint: http://service-stage
```

### Inject local variables
This extension will inject variable from local scope.

- config.yml
```yaml 
version : 1
env: stage
config: ${file(./common.yml)}
```

- common.yml
```yaml
port: 8080
endpoint: http://service:${self:port}
```

- Generated final yaml
```yaml
version : 1
env: stage
config: 
  port: 8080
  endpoint: http://service:8080
  ```
