import Section from '../support/Section.js';

const languages= {};

const CONTEXTS= Symbol( 'CONTEXTS', );
const RELATION= Symbol( 'RELATION', );

export default class Language
{
	constructor( { contexts, relation, extending, }, )
	{
		if( extending )
		{
			if(!( Language.has( extending, ) )) throw `Language ${extending} not exists.`;
			
			Object.assign( _(this), _(Language.get( extending, )) );
		}
		
		this[CONTEXTS]= Object.assign( {}, contexts, { '__whole__':{ header:/^/, footer:/$/, }, '__char__':{ header:/\b|\B/, }, }, );
		this[RELATION]= Object.assign( { '__whole__':Object.keys( contexts ).filter( x=>x.slice( 0, 2 )!=='__' ), }, relation, );
	}
	
	parse( content, contextNode, )
	{
		const section= new Section( content );
		
		this.parseLoop( section, contextNode );
		
		return contextNode;
	};
	
	parseLoop( section, contextNode, )
	{
		const footer= this.getCloser( contextNode.type );
		
		let i= 0;
		
		do{
			const closed= section.pull( footer )
			
			if( closed!==false ) return contextNode.close( closed );
			
			this.parseInContext( section, contextNode );
			
			++i;
			
		}while(!( section.isOver || i>32 ));
	};
	
	parseInContext( section, contextNode, )
	{
		
		const subContexts= this.getSubContexts( contextNode.type );
		
		if( subContexts && subContexts.length )
		{
			const[ i, header, ]= section.variousPull( subContexts.map( x=>this[CONTEXTS][x].header ).filter( x=>x instanceof RegExp ) );
			
			if( i!==false )
			{
				const childNode= contextNode.createChild( subContexts[i], header );
				
				this.parseLoop( section, childNode );
				
				return;
			}
		}
		
		contextNode.createVChar( section.cutChar() )
	};
	
	getCloser( context, )
	{
		return this[CONTEXTS][context].footer;
	};
	
	getSubContexts( context, )
	{
		return this[RELATION][context]||[];
	};
	
	static has( name, )
	{
		return !!languages[name];
	}
	
	static get( name, )
	{
		return languages[name];
	}
	
	static define( name, options, )
	{
		if( this.has( name ) ) throw `Language ${name} is already defined.`;

		languages[name]= new this( options );
	}
}

