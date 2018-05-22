import VNode from './VNode.js';
import createDOM from './createDOM.js';

export default class VChar extends VNode
{
	constructor( char, )
	{
		super();

		this.char= char;
		this.code= char.charCodeAt( 0, );
		this.CODE= this.code.toString( 0x10, );
		this.length= this.CODE.length/2;
		this.type= (
			0x9===this.code ? 'tab' :
			0xA===this.code ? 'line_feed' :
			'normal'
		);
	}

	makeDOM()
	{
		return createDOM(
			'code',
			[ '__char__', `char-code_${this.CODE}`, ],
			this.char, this.length>1? { style:'--letter-count:'+this.length, } : null,
		);
	}
}
