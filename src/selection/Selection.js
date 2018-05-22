export default class Selection
{
	constructor()
	{
		const range= new Range( 0, );
		
		this.mainRange= range;
		this.ranges= [ range, ];
		this.frozenRangs= new Map;
	}
	
	forEach( callback, ignoreFrozen=true, )
	{
		this.ranges.forEach( callback, );
		
		ignoreFrozen || frozenRangs.forEach( callback, );
	}
	
	merge( range, )
	{
		for( let[ i, x, ] of this.ranges.entries() )
		{
			switch( Range.compare( x, range, ) )
			{
				case 1: continue;
				
				case 0:
					this.ranges.splice( i, 1, Range.merge( x, range, ), );
					
					this.frozenRangs;
					
				return;
				
				case -1:
					this.ranges.splice( i, 0, Range.clone( range, ), );
					
				return;
			}
		}
	}
}
