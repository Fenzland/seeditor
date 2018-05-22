export default function createDOM( name, ...args )
	{
		const dom= document.createElement( name, );

		args.forEach( arg=>{
			if( typeof arg==='function' || arg instanceof Function )
			{
				arg( dom, );
			}
			else
			if( typeof arg==='string' || arg instanceof String )
			{
				dom.innerHTML= arg;
			}
			else
			if( arg instanceof Array )
			{
				arg.forEach( className=> dom.classList.add( className, ), );
			}
			else
			if( arg instanceof Element )
			{
				dom.appendChild( arg, );
			}
			else
			if( typeof arg==='object' || arg instanceof Object )
			{
				for( let k in arg )
				{
					let v= arg[k];

					( v===null || typeof v==='undefined' ) || dom.setAttribute( k, v, );
				}
			}
		}, );

		return dom;
	}
