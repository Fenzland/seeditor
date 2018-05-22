import Language from '../languages/Language.js';
import '../languages/text/plain.js';
import Selection from '../selection/Selection.js';
import VElement from '../vnode/VElement.js';

export default class Doc
{
	constructor( language='text/plain', content='' )
	{
		this.language= Language.get( language ) || Language.get( 'text/plain' );
		this.selection= new Selection();
		this.vChars= [];

		content && this.load( content );
	}

	load( content )
	{
		this.vtree= this.language.parse( content, new VElement( this ) );
	}

	addVChar( vChar )
	{
		this.vChars.push( vChar );
	}

	input( char )
	{
		;
	}

	moveSelection( { axis, direction, unit, amount, } )
	{
		this[`${axis}Move`]( unit, direction*amount );

		this.selection.forEach( regin=>{
			regin.caret
		} );
	}

	horizontalMove( unit, amount )
	{
		this.selection.forEach( regin=>{
			regin.caret
		} );
	}

	getMainCaretPosition()
	{
		const at= this.selection.mainRange.caret;

		let[ row, col, ]= [ 0, 0, ];

		for( let[ i, vChar, ] of this.vChars.entries() )
		{
			if( i>=at ) break;

			if( vChar.type==='line_feed' )
			{
				++row;
				col= 0;
			}else{
				++col;
			}
		}

		return [ row, col ];
	}
}
