import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class TinyMCEComponent implements ComponentFramework.StandardControl<IInputs, IOutputs> {
// Reference to ComponentFramework Context object
	private _context: ComponentFramework.Context<IInputs>;

	// PCF framework delegate which will be assigned to this object which would be called whenever any update happens. 
	private _notifyOutputChanged: () => void;

	private _container : HTMLDivElement;
	private _textEditor : HTMLTextAreaElement;
	private _textValue : string;
	private _domId: string;
	private _tinymce: any;

	constructor()
	{
		this._tinymce = require('tinymce/tinymce');
		require('tinymce/themes/silver');
		require('tinymce/icons/default');

		require('tinymce/models/dom');

		

		// Any plugins you want to use has to be imported
		//require('tinymce/plugins/paste');
		require('tinymce/plugins/link');
		require('tinymce/plugins/lists');
		require('tinymce/plugins/autoresize');
		require('tinymce/plugins/code');


		require('tinymce/plugins/advlist');
		require('tinymce/plugins/autolink');
		require('tinymce/plugins/image');
		require('tinymce/plugins/charmap');
		require('tinymce/plugins/preview');
		require('tinymce/plugins/anchor');
		
		require('tinymce/plugins/searchreplace');
		require('tinymce/plugins/visualblocks');
		require('tinymce/plugins/fullscreen');
		require('tinymce/plugins/insertdatetime');
		require('tinymce/plugins/media');
		require('tinymce/plugins/table');
		require('tinymce/plugins/help');
		require('tinymce/plugins/wordcount');
	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		this._context = context;
		this._notifyOutputChanged = notifyOutputChanged;
		this._textValue = this._context.parameters.textField.raw || "";
		this._container = container;
		this._domId = this.ID();
		this._textEditor = document.createElement("textarea");		
		this._textEditor.setAttribute("id", "text_editor"+this._domId);		
		this._textEditor.innerHTML= this._textValue;
		this._container.appendChild(this._textEditor);		
		container = this._container;

		// Add control initialization code
		this.loadWidget();
	}

	public loadWidget() {
			
			this._tinymce.init({
				selector: '#text_editor'+this._domId,
				height: 500,
				plugins: [
				  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
				  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
				  'insertdatetime', 'media', 'table', 'help', 'wordcount'
				],
				toolbar: 'undo redo | blocks | ' +
				'bold italic backcolor | alignleft aligncenter ' +
				'alignright alignjustify | bullist numlist outdent indent | ' +
				'removeformat | help',
				content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
			  });

}

	ID = function () {
		// Math.random should be unique because of its seeding algorithm.
		// Convert it to base 36 (numbers + letters), and grab the first 9 characters
		// after the decimal.
		return '_' + Math.random().toString(36).substr(2, 9);
	  };

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		// Add code to update control view
		this._context = context;
		this._textValue = this._context.parameters.textField.raw || "";
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */

	public getOutputs(): IOutputs
	{
		return {
			textField : this._textValue
		};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
	}
}
