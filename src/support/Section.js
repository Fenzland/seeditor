export default class Section
{
	constructor( content )
	{
		this.content= content;
	}

	cutChar( num=1 )
	{
		const result= this.content.slice( 0, num );

		this.content= this.content.slice( num );

		return result;
	}

	pull( pattern )
	{
		if( 0!==this.content.search( pattern ) ) return false;

		const result= this.content.match( pattern )[0];

		this.content= this.content.slice( result.length );

		return result;
	}

	variousPull( patterns )
	{
		for( let[ i, pattern, ] of patterns.entries() )
		{
			const result= this.pull( pattern );

			if( result!==false )
			{
				return [ i, result, ];
			}
		}

		return [ false, false ];
	}

	pullAll()
	{
		const content= this.content;

		this.content= '';

		return content;
	}

	get isOver()
	{
		return !this.content.length;
	}
}
