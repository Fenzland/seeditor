export default class Range
{
	constructor( base=0, caret=undefined, )
	{
		if( isNaN( caret, ) )
			caret= base;
		
		this.base= base;
		this.caret= caret;
	}
	
	move( distance, )
	{
		this.caret-=- distance;
		
		return this;
	}
	
	moveHip( distance, )
	{
		this.base-=- distance;
		
		return this;
	}
	
	reverce()
	{
		[ this.base, this.caret, ]= [ this.caret, this.base, ];
		
		return this;
	}
	
	shrink( reverce=false, )
	{
		if( reverce )
			this.reverce();
		
		this.base= this.caret;
		
		return this;
	}
	
	get isForward()
	{
		return this.caret>this.base;
	}
	
	get left()
	{
		return this.isForward? this.base : this.caret;
	}
	
	get right()
	{
		return this.isForward? this.caret : this.base;
	}
	
	contains( range, )
	{
		return this.left<range.left && this.right>range.right;
	}
	
	static clone( range, )
	{
		return new Range( x.base, x.caret, );
	}
	
	static compare( x, y, )
	{
		return (
			x.left>y.tail ? 1 :
			y.left>x.tail ? -1 :
			0
		);
	}
	
	merge( x, y, )
	{
		return (
			x.contains( y, ) ? Range.clone( x, ) :
			y.contains( x, ) ? Range.clone( y, ) :
			new Range( ...(
				(( l, r, )=> l.isForward||r.isForward? [ l, r, ] : [ r, l ] )(
					...( x.left<y.left? [ x.left, y.right, ] : [ x.left, y.right, ] ),
				)
			), )
		);
	}
}

