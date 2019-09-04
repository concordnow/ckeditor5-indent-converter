export const POINT_TO_PIXEL_MULTIPLICATOR = ( 2 / 3 * 2 );

export function getRoundedValue( value ) {
	switch ( true ) {
		case value.indexOf( 'pt' ) > -1:
			value = parseFloat( value.replace( 'pt', '' ) ) * POINT_TO_PIXEL_MULTIPLICATOR;
			break;
		case value.indexOf( 'px' ) > -1:
			value = parseFloat( value.replace( 'px', '' ) );
			break;
	}

	return Math.round( value );
}
