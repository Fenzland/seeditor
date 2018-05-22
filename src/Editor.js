import Doc from './doc/Doc.js';
import createDOM from './vnode/createDOM.js';
import KeyMap from './support/KeyMap.js';

export default class Editor
{
	constructor( element, root=undefined, )
	{
		this.element= element;
		this.root= root||element;
		this.doc= new Doc( element.getAttribute( 'language' )||'text/plain', element.innerHTML, );
		this.keyMap= new KeyMap();
		
		this.loadDefaultCommands();
		this.initDom();
		this.initListener();
		
		this.render();
	}
	
	loadDefaultCommands()
	{
		this.commands= {
			input: ( contents, )=> (contents.forEach( content=> this.input( content, ), ) , true),
			delete: ( { direction, unit, amount, }, )=> (
				this.inputPort.value
				? (this.inputPort.value= this.inputPort.value.slice( 0,-1, ))
				: (this.view.innerHTML= this.view.innerHTML.slice( 0,-1, ))
			),
			move: ( args, )=> this.doc.moveSelection( args, ) && this.placeInputPort(),
		};
	}
	
	initDom()
	{
		this.element.innerHTML= '';
		this.element.appendChild(
			this.valueHost= createDOM( 'input', { type:'hidden', name:this.element.getAttribute( 'name', ), }, ),
		);
		
		this.root.appendChild( this.createStyle() );
		this.root.appendChild( this.view= createDOM( 'main' ) );
		this.root.appendChild(
			this.inputPort= createDOM(...[
				'input',
				[ 'input-port', ],
				{ type:'search', },
			])
		);
	}
	
	initListener()
	{
		this.element.addEventListener( 'click', ()=>this.inputPort.focus() );
		
		// Listen input
		this.inputPort.addEventListener( 'input', e=>{
			
			if( _(this).continuallyInput ) return;
			
			this.input( '' );
		} );
		
		// Listen other keys
		this.inputPort.addEventListener( 'keydown', e=>{
			
			if( e.key==='Unidentified' )
			{
				e.preventDefault();
				
				_(this).continuallyInput= true;
				
				return;
			}
			
			_(this).continuallyInput= false;
			
			const modifier= (e.shiftKey&&1)|(e.ctrlKey&&2)|(e.altKey&&4)|(e.metaKey&&8);
			
			this.keyPress( e.key, modifier ) && e.preventDefault();
		} );
		
		// Hack for Esc
		this.inputPort.addEventListener( 'blur', e=>{
			
			const indicator= new Indicator();
			
			const windowBlur= e=>{
				
				indicator.reject();
				
				window.removeEventListener( 'blur', windowBlur );
			};
			
			window.addEventListener( 'blur', windowBlur );
			
			indicator.then( ()=>{
				
				this.keyPress( 'Esc' );
				
				this.inputPort.focus();
				
			} ).catch( ()=>{} );
			
			setTimeout( ()=>e.sourceCapabilities? indicator.reject() : indicator.resolve()  );
		} );
		
		this.inputPort.addEventListener( 'click', function(e){ this.value= this.value; } );
	}
	
	render()
	{
		this.view.appendChild( this.doc.vtree.render() );
		this.placeInputPort();
	}
	
	input( string )
	{
		const value= this.inputPort.value;
		
		if( value )
		{
			this.inputPort.value= '';
			
			return this.input( `${value}${string}`.trimRight() );
		}
		
		Array.from( string ).forEach( char=> this.doc.input( char ) );
		
		this.view.innerHTML+= string;
		
		this.placeInputPort();
	}
	
	placeInputPort()
	{
		const[ row, col, ]= this.doc.getMainCaretPosition();
		
		Object.assign( this.inputPort.style, {
			'--row': row,
			'--col': col,
		} );
	}
	
	keyPress( key, modifier )
	{
		const action= this.keyMap.seek( `${key}_${modifier}` );
		
		return action && this.runCommand( action );
	}
	
	runCommand( action )
	{
		const command= this.commands[action.command];
		
		return command && command( action.args );
	}
	
	addListeners( document )
	{
		;
	}
	
	removeListeners()
	{
		;
	}
	
	focus()
	{
		this.inputPort.focus();
	}
	
	blur()
	{
		this.inputPort.blur();
	}
	
	createStyle()
	{
		return createDOM( 'style', /*CSS*/`
			
			 /*base*/
			 :host
			 {
			 	--letter-width: 0.6em;
			 	--line-height: 2;
			 	--font-size: 1.4;
			 	--tab-size: 4;
			 	
			 	position: relative;
			 	display: block;
			 }
			 
			 main
			 {
			 	user-select: none;
			 	cursor: default;
			 	line-height: calc( var( --line-height )*1em );
			 	font-size: calc( var( --font-size )*10px )
			 }
			 
			 code
			 {
			 	white-space: pre;
			 	letter-spacing: 0;
			 	box-sizing: border-box;
			 	cursor: default;
			 }
			 
			 code.__char__
			 {
			 	--letter-count: 1;
			 	display: inline-block;
			 	text-align: center;
			 	width: calc( var( --letter-count )*var( --letter-width ) );
			 }
			 
			 code.indent>code.children>code.__char__
			 {
			 	width: calc( var( --tab-size )*var( --letter-width ) );
			 }
			 
			 .input-port
			 {
			 	--row: 0;
			 	--col: 0;
			 	position: absolute;
			 	z-index: 1;
			 	top:  calc( var( --row )*var( --line-height  )*1em );
			 	left: calc( var( --col )*var( --letter-width ) );
			 	border: none;
			 	outline: none;
			 	resize: none;
			 	padding: 0;
			 	font-family: monospace;
			 	font-size: calc( var( --font-size )*10px );
			 	line-height: calc( var( --line-height )*1em );
			 	background-color: transparent;
			 	cursor: default;
			 	caret-color: transparent;
			 }
			 .input-port::-webkit-textfield-decoration-container
			 {
			 	display: inline-block;
			 	height: 100%;
			 	position: relative;
			 	border-right: 2px solid var( --bgc );
			 }
			 .input-port::-webkit-search-cancel-button
			 {
			 	-webkit-appearance: none;
			 	appearance: none;
			 	position: absolute;
			 	right: 0;
			 	border-right: 2px solid var( --bgc );
			 	height: 100%;
			 }
			 
			 /*theme*/
			 :host
			 {
			 	--fgc-H: 0;
			 	--fgc-S: 0;
			 	--fgc-L: 1;
			 	--bgc-H: 0;
			 	--bgc-S: 0;
			 	--bgc-L: .2;
			 	
			 	--fgc: hsl( var( --fgc-H ), calc( var( --fgc-S )*100% ), calc( var( --fgc-L )*100% ) );
			 	--bgc: hsl( var( --bgc-H ), calc( var( --bgc-S )*100% ), calc( var( --bgc-L )*100% ) );
			 	color: var( --fgc );
			 	background-color: var( --bgc );
			 }
			 
			 .input-port
			 {
			 	color: var( --bgc );
			 	border-left: 2px solid currentColor;
			 	animation: caret-blink-border 1s linear infinite;
			 }
			 .input-port::-webkit-textfield-decoration-container
			 {
			 	color: var( --bgc );
			 	background-color: var( --fgc );
			 	animation: caret-blink-border 1s linear infinite;
			 }
			 .input-port::-webkit-search-cancel-button
			 {
			 	background-color: var( --bgc );
			 	animation: caret-blink-border 1s linear infinite;
			 }
			 
			 @keyframes caret-blink-border
			 {
			 	000% { border-color: var( --fgc ); }
			 	050% { border-color: var( --bgc ); }
			 	100% { border-color: var( --fgc ); }
			 }
			 
			 /*highlight*/
			 code.indent>code.children>code.__char__
			 {
			 	background-color: hsla( var( --fgc-H ), calc( var( --fgc-S )*100% ), calc( var( --fgc-L )*100% ), 0.15 );
			 }
			 code.indent>code.children>code.__char__:not(:last-child)
			 {
			 	border-right: 1px dotted currentColor;
			 	clip-path: polygon( 0 calc( 50% - .5em ) , calc( 100% - 2px ) calc( 50% - .5em ) , calc( 100% - 2px ) 0 , 100% 0, 100% 100% , calc( 100% - 2px ) 100% , calc( 100% - 2px ) calc( 50% + .5em ) , 0 calc( 50% + .5em ) );
			 }
			 code.indent>code.children>code.__char__:last-child
			 {
			 	clip-path: polygon( 0 calc( 50% - .5em ) , 70% calc( 50% - .5em ) , calc( 100% - 2px ) 50% , calc( 100% - 2px ) 50% , 70% calc( 50% + .5em ) , 0 calc( 50% + .5em ) );
			 }
			 
			 code.line>code.footer::before
			 {
			 	content: '';
			 	display: inline-block;
			 	vertical-align: middle;
			 	width: 1em;
			 	height: 1em;
			 	background-color: hsla( var( --fgc-H ), calc( var( --fgc-S )*100% ), calc( var( --fgc-L )*100% ), .25 );
			 	clip-path: polygon( 0 100% , 40% 60% , 40% 90% , 90% 90% , 90% 30% , 100% 30% , 100% 100% );
			 }
			 
			 code.__char__.char-code_20
			 {
			 	background-color: hsla( var( --fgc-H ), calc( var( --fgc-S )*100% ), calc( var( --fgc-L )*100% ), .25 );
			 	clip-path: polygon( 0 50% , 50% calc( 50% - 0.3em ) , 100% 50% , 50% calc( 50% + 0.3em ) );
			 }
			 
			 /*font*/
			 /** /
			 code.char-code_35
			 {
			 	color: red;
			 	background-color: var( --fgc );
			 	clip-path: polygon( calc( 50% - .3em ) calc( 50% - .4em ) , calc( 50% + .3em ) calc( 50% - .4em ) , calc( 50% + .3em ) calc( 50% - .3em ) , calc( 50% - .2em ) calc( 50% - .3em ) , calc( 50% - .2em ) calc( 50% - .2em ) , calc( 50% + .3em ) calc( 50% - .2em ) , calc( 50% + .3em ) calc( 50% - .1em ) , calc( 50% - .2em ) calc( 50% - .1em ) , calc( 50% - .2em ) 50% , calc( 50% + .1em ) 50% , calc( 50% + .2em ) calc( 50% + .1em ) , calc( 50% + .3em ) calc( 50% + .3em ) , calc( 50% + .3em ) calc( 50% + .4em ) , calc( 50% - .3em ) calc( 50% + .4em ) );
			 }
			 /**/
		`.split( '\n' ).map( x=>x.replace( /^\t* /, '' ) ).join( '\n' ) );
	}
}
