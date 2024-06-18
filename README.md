# rest-ahk
> Compile service for AutoHotkey scripts

[![Build Status](https://travis-ci.org/zvecr/rest-ahk.svg?branch=master)](https://travis-ci.org/zvecr/rest-ahk)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/0c69e40060e94ff9989c25fb3e23bd1b)](https://app.codacy.com/app/zvecr/rest-ahk?utm_source=github.com&utm_medium=referral&utm_content=zvecr/rest-ahk&utm_campaign=Badge_Grade_Dashboard)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=zvecr/rest-ahk)](https://dependabot.com)

REST service for compiling AutoHotkey scripts `.ahk` to `.exe`

Behind the scenes, `wine` and `xvfb` are used to run `Ahk2Exe`, producing a lightweight Linux based container, deployable almost anywhere.

For the UI, see the [zvecr/vue-ahk](https://github.com/zvecr/vue-ahk) project.

## Dependencies
* nodejs (and npm)
* wine
* xvfb
* Ahk2Exe (Installed to the wine path)

## Examples
The following examples assume either node is running the project or the `rest-ahk` docker container is running locally.

### POST /compile Example
**Note:** While this example uses Unix-like paths, the following will produce a Windows executable.

```bash
curl -X POST -H "Content-Type: text/plain" --output /tmp/test.exe --data '
^j::                    
Send, My First Script
return                  
' localhost:8080/compile
```

### GET /status Example
To status endpoint can be used to view the current service status, including various compile stats.

```bash
curl http://localhost:8080/status
```

Which should produce a JSON object.
```json
{"compile":{"queue":0,"cache":0}}
```

## Development
For convenience a `.nvmrc` file has been provided at the root of the project directory.

### Project setup
```bash
npm install
```

### Compiles and hot-reloads for development
```bash
npm run serve
```

### Compiles and minifies for production
```bash
npm run build
```

### Compiles and runs for production
```bash
npm run start
```

### Run your tests
```bash
npm run test
```

### Lint files
```bash
npm run lint
```

## Docker
A simple workflow to package (and run) the service for production.

```bash
docker build --rm -f "Dockerfile" -t rest-ahk:latest .

docker run --rm -it -p 8080:8080/tcp rest-ahk:latest
```
