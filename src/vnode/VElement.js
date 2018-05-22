import VNode from './VNode.js';
import VChar from './VChar.js';
import createDOM from './createDOM.js';

export default class VElement extends VNode
{
	constructor( doc, type='__whole__', )
	{
		super();

		this.doc= doc;
		this.type= type;
		this.children= [];
	}

	open( header, )
	{
		this.header= header;

		return this;
	}

	close( footer, )
	{
		this.footer= footer;

		if(!( this.header || this.footer || this.content || this.children.length ))
		{
			throw `context "${this.type}" is not match anything`;
		}

		return this;
	}

	createChild( type, header='', )
	{
		const child= new VElement( this.doc, type, ).open( header, );

		this.children.push( child, );

		return child;
	}

	createVChar( char, )
	{
		const vChar= new VChar( char, );

		this.doc.addVChar( vChar, );

		this.children.push( vChar, );

		return vChar;
	}

	setContent( content, )
	{
		this.content= content;

		return this;
	}

	makeDOM()
	{
		return (
			this.content && !(this.header || this.footer)
			? createDOM( 'code', [ this.type, ], this.content, )
			: createDOM( 'code', [ this.type, ], ...[
				this.header? createDOM( 'code', [ 'header', ], this.header, ) : null,

				this.content? createDOM( 'code', [ 'content', ], this.content, ) :
				this.children.length? createDOM( 'code', [ 'children', ], ...this.children.map( x=>x.render(), ), ) :
				null,

				this.footer? createDOM( 'code', [ 'footer', ], this.footer, ) : null,
			].filter( x=> x, ), )
		)
	}
}
