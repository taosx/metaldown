const electron = require( 'electron' );
const child = require( 'child_process' ).spawn;
const path = require( "path" );
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const handleSquirrelEvent = require( "./squirrelEvents" )

// if (require('electron-squirrel-startup')) return;

if ( handleSquirrelEvent( app ) ) {
	return;
}

// Set binary path according to the platform on which is run
let binPath;
switch ( process.platform ) {
case "win32":
	binPath = path.resolve( __dirname, path.join( "vendor", "bin", "win32", "app.exe" ) );
	break;
case "linux":
	binPath = path.resolve( __dirname, path.join( "vendor", "bin", "linux", "app" ) );
	break;
case "win":
	binPath = path.resolve( __dirname, path.join( "vendor", "bin", "win", "app.exe" ) );
	break;
}


// Run the binary server and log that it started
let server = ( function () {
	console.log( "[LOG] Server started" );
	return child( binPath )
} )()

server.stdout.on( 'data', data => {
	console.log( `stdout: ${data}` );
} )

server.stderr.on( 'data', data => {
	console.log( `stderr: ${data}` );
} )

server.on( 'close', code => {
	console.log( `child process exited with code ${code}` );
} )

let mainWindow;

function createWindow() {
	const {
		width,
		height
	} = electron.screen.getPrimaryDisplay().workAreaSize

	mainWindow = new BrowserWindow( {
		width: width,
		height: height,
		'auto-hide-menu-bar': true,
		toolbar: false
	} )

	mainWindow.setMenuBarVisibility( false );
	mainWindow.setAutoHideMenuBar( true );

	// and load the index.html of the app.
	mainWindow.loadURL( `http://localhost:8080/` )

	// Emitted when the window is closed.
	mainWindow.on( 'closed', function () {
		server.kill( "SIGINT" )
		mainWindow = null
	} )

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on( 'ready', function () {
	createWindow()
} )

// Quit when all windows are closed.
app.on( 'window-all-closed', function () {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if ( process.platform !== 'darwin' ) {
		app.quit()
	}

} )

app.on( 'activate', function () {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if ( mainWindow === null ) {
		createWindow()
	}

} )
