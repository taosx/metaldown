# metaldown

A simple warehouse tracking desktop application for a metal factory. 

![Screenshot](http://i.imgur.com/CKrutOo.png)

Built using:
* Golang
  - Fasthttp
* Javascript
  - Electron
  - Electron-builder
  - Datatables
  - Bootstrap
  - Uglify, Browserify
  
Build for a OS of your choice with:

You need to have [Electron Builder](https://github.com/electron-userland/electron-builder) installed globally in order to do a `build --platform of choice`
```bash
npm install
cd src && npm install
npm run build # this will generate an app folder in the root project directory
cd .. && build --linux # this will generate a dist/linux-unpacked folder in the root project directory
```

and run with:

```bash
cd dist/linux-unpacked # or the generated folded depending on your os (ls -l)
./Αποθήκη - Δάφνη Ο.Ε
```
