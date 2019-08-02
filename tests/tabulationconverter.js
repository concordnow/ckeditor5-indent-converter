import TabulationConverter from './../src/tabulationconverter';
import ParagraphTabulationConverter from './../src/paragraphtabulationconverter';

describe( 'TabulationConverter', () => {
	it( 'requires ParagraphTabulationConverter', () => {
		expect( TabulationConverter.requires ).to.deep.equal( [ ParagraphTabulationConverter ] );
	} );

	it( 'defines plugin name', () => {
		expect( TabulationConverter.pluginName ).to.equal( 'TabulationConverter' );
	} );
} );
