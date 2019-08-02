import Plugin from '@ckeditor/ckeditor/ckeditor5-core/src/plugin';
import ParagraphTabulationConverter from './paragraphtabulationconverter';

export default class TabulationConverter extends Plugin {
	static get requires() {
		return [ ParagraphTabulationConverter ];
	}

	static get pluginName() {
		return 'TabulationConverter';
	}
}
