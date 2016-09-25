let Btn = require( "./buttons/" );
let dt = require( "./datatable" );
let theme = require( "./theme" );


let size = () => {
	return document.documentElement.clientHeight - ( document.documentElement.clientWidth > 768 ? 187 : 317 )
};

function onloadcomplete() {
	setTimeout( function () {
		$( "#example" ).trigger( "domChanged" );
	}, 100 )

	let table = dt.datatable( size );

	fetch( "/stats" ).then( res => {
		return res.json()
	} ).then( json => {
		let internIP = $( ".breadcrumb span" )[ 1 ]
		internIP.textContent += json.local + ":8080";
		let externIP = $( ".breadcrumb span" )[ 2 ]
		externIP.textContent += json.external + ":8080";
	} )


	dt.select( table );

	theme()

	let inputs = $( ".modal-body .form-control" );

	inputs.on( "click", function () {
		$( this ).select();
	} );

	$( "table th" ).click( () => {
		$( "#example" ).trigger( "domChanged" );
	} )


}

function styler() {
	var scrollBody = document.getElementsByClassName( "dataTables_scrollBody" )[ 0 ].style.maxHeight = size() + "px";
}

onload = onloadcomplete
window.onresize = styler
