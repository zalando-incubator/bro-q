import * as ace from 'brace'
import { h, Component } from 'preact'
import { isEqual, debounce } from 'lodash'

const { Range } = ace.acequire('ace/range');
import editorOptions from './_aceEditorOptions'

require('brace/mode/json');
require('brace/theme/github');

export interface AceEditorProps {
  mode?: string;
  focus?: boolean;
  theme?: string;
  name?: string;
  className?: string;
  height?: string;
  width?: string;
  fontSize?: number | string;
  showGutter?: boolean;
  onChange?: (text:string, event:any)=>void;
  onCopy?: (text)=>void;
  onPaste?: (text:string)=>void;
  onFocus?: (event:any)=>void;
  onInput?: (event:any)=>void;
  onBlur?: (event:any, editor:ace.Editor)=>void;
  onScroll?: (editor:ace.Editor)=>void;
  value?: string;
  defaultValue?: string;
  onLoad?: (editor:ace.Editor)=>void;
  onSelectionChange?: (selection:ace.Selection, event:any)=>void;
  onCursorChange?: (selection:ace.Selection, event:any)=>void;
  onBeforeLoad?: (editor:ace.Editor)=>void;
  onValidate?: (any)=>void;
  minLines?: number;
  maxLines?: number;
  readOnly?: boolean;
  highlightActiveLine?: boolean;
  tabSize?: number;
  showPrintMargin?: boolean;
  cursorStart?: number;
  debounceChangePeriod?: number;
  editorProps?: object;
  setOptions?: object;
  style?: object;
  scrollMargin?: Array<number>;
  annotations?: Array<any>;
  markers?: Array<any>;
  keyboardHandler?: string;
  wrapEnabled?: boolean;
  enableBasicAutocompletion?: boolean | Array<any>;
  enableLiveAutocompletion?: boolean | Array<any>;
}

interface AceEditorState {

}

export default class AceEditor extends Component<AceEditorProps, AceEditorState> {
  defaultProps:AceEditorProps = {
    name: 'brace-editor',
    focus: false,
    mode: '',
    theme: '',
    height: '500px',
    width: '500px',
    value: '',
    fontSize: 12,
    showGutter: true,
    onChange: null,
    onPaste: null,
    onLoad: null,
    onScroll: null,
    minLines: null,
    maxLines: null,
    readOnly: false,
    highlightActiveLine: true,
    showPrintMargin: true,
    tabSize: 4,
    cursorStart: 1,
    editorProps: {},
    style: {},
    scrollMargin: [ 0, 0, 0, 0],
    setOptions: {},
    wrapEnabled: false,
    enableBasicAutocompletion: false,
    enableLiveAutocompletion: false,
  };
  editor:ace.Editor;
  refEditor:any;
  silent:boolean = false;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {
      className,
      onBeforeLoad,
      onValidate,
      mode,
      focus,
      theme,
      fontSize,
      value,
      defaultValue,
      cursorStart,
      showGutter,
      wrapEnabled,
      showPrintMargin,
      scrollMargin = [ 0, 0, 0, 0],
      keyboardHandler,
      onLoad,
      annotations,
      markers,
    } = this.props;

    this.editor = ace.edit(this.refEditor);

    if (onBeforeLoad) {
      onBeforeLoad(this.editor);
    }

    const editorProps = Object.keys(this.props.editorProps);
    for (let i = 0; i < editorProps.length; i++) {
      this.editor[editorProps[i]] = this.props.editorProps[editorProps[i]];
    }
    if (this.props.debounceChangePeriod) {
      this.onChange = debounce(this.onChange, this.props.debounceChangePeriod);
    }
    this.editor.renderer.setScrollMargin(scrollMargin[0], scrollMargin[1], scrollMargin[2], scrollMargin[3])
    this.editor.getSession().setMode(`ace/mode/${mode}`);
    // this.editor.setTheme(`ace/theme/github`);
    this.editor.setFontSize(typeof fontSize === 'number' ? `{fontSize}px`: fontSize);
    this.editor.getSession().setValue(!defaultValue ? value : defaultValue);
    this.editor.navigateFileEnd()
    this.editor.renderer.setShowGutter(showGutter);
    this.editor.getSession().setUseWrapMode(wrapEnabled);
    this.editor.setShowPrintMargin(showPrintMargin);
    this.editor.on('focus', this.onFocus);
    this.editor.on('blur', this.onBlur);
    this.editor.on('copy', this.onCopy);
    this.editor.on('paste', this.onPaste);
    this.editor.on('change', this.onChange);
    this.editor.on('input', this.onInput);
    this.editor.getSession().selection.on('changeSelection', this.onSelectionChange);
    this.editor.getSession().selection.on('changeCursor', this.onCursorChange);
    if (onValidate) {
      this.editor.getSession().on('changeAnnotation', () => {
        const annotations = this.editor.getSession().getAnnotations();
        this.props.onValidate(annotations);
      });
    }
    this.editor.session.on('changeScrollTop', this.onScroll);
    this.editor.getSession().setAnnotations(annotations || []);
    if(markers && markers.length > 0){
      this.handleMarkers(markers);
    }

    // get a list of possible options to avoid 'misspelled option errors'
    // @ts-ignore
    const availableOptions = this.editor.$options;
    for (let i = 0; i < editorOptions.length; i++) {
      const option = editorOptions[i];
      if (availableOptions.hasOwnProperty(option)) {
        this.editor.setOption(option, this.props[option]);
      } else if (this.props[option]) {
        console.warn(`AceEditor: editor option ${option} was activated but not found. Did you need to import a related tool or did you possibly mispell the option?`)
      }
    }
    this.handleOptions(this.props);

    if (keyboardHandler) {
      this.editor.setKeyboardHandler('ace/keyboard/' + keyboardHandler);
    }

    if (className) {
      this.refEditor.className += ' ' + className;
    }

    if (focus) {
      this.editor.focus();
    }

    if (onLoad) {
      onLoad(this.editor);
    }

    this.editor.resize();
  }

  componentWillReceiveProps(nextProps) {
    const oldProps = this.props;

    for (let i = 0; i < editorOptions.length; i++) {
      const option = editorOptions[i];
      if (nextProps[option] !== oldProps[option]) {
        this.editor.setOption(option, nextProps[option]);
      }
    }

    if (nextProps.className !== oldProps.className) {
      let appliedClasses = this.refEditor.className;
      let appliedClassesArray = appliedClasses.trim().split(' ');
      let oldClassesArray = oldProps.className.trim().split(' ');
      oldClassesArray.forEach((oldClass) => {
        let index = appliedClassesArray.indexOf(oldClass);
        appliedClassesArray.splice(index, 1);
      });
      this.refEditor.className = ' ' + nextProps.className + ' ' + appliedClassesArray.join(' ');
    }

    // First process editor value, as it may create a new session (see issue #300)
    if (this.editor && this.editor.getValue() !== nextProps.value) {
      // editor.setValue is a synchronous function call, change event is emitted before setValue return.
      this.silent = true;
      const pos = this.editor.session.selection.getSelectionAnchor();
      this.editor.setValue(nextProps.value, nextProps.cursorStart);
      this.editor.session.selection.setSelectionAnchor(pos.row, pos.column);
      this.silent = false;
    }

    if (nextProps.mode !== oldProps.mode) {
      this.editor.getSession().setMode('ace/mode/' + nextProps.mode);
    }
    if (nextProps.theme !== oldProps.theme) {
      this.editor.setTheme('ace/theme/' + nextProps.theme);
    }
    if (nextProps.keyboardHandler !== oldProps.keyboardHandler) {
      if (nextProps.keyboardHandler) {
        this.editor.setKeyboardHandler('ace/keyboard/' + nextProps.keyboardHandler);
      } else {
        this.editor.setKeyboardHandler(null);
      }
    }
    if (nextProps.fontSize !== oldProps.fontSize) {
      this.editor.setFontSize(nextProps.fontSize);
    }
    if (nextProps.wrapEnabled !== oldProps.wrapEnabled) {
      this.editor.getSession().setUseWrapMode(nextProps.wrapEnabled);
    }
    if (nextProps.showPrintMargin !== oldProps.showPrintMargin) {
      this.editor.setShowPrintMargin(nextProps.showPrintMargin);
    }
    if (nextProps.showGutter !== oldProps.showGutter) {
      this.editor.renderer.setShowGutter(nextProps.showGutter);
    }
    if (!isEqual(nextProps.setOptions, oldProps.setOptions)) {
      this.handleOptions(nextProps);
    }
    if (!isEqual(nextProps.annotations, oldProps.annotations)) {
      this.editor.getSession().setAnnotations(nextProps.annotations || []);
    }
    if (!isEqual(nextProps.markers, oldProps.markers) && (Array.isArray(nextProps.markers))) {
      this.handleMarkers(nextProps.markers);
    }

    // this doesn't look like it works at all....
    if (!isEqual(nextProps.scrollMargin, oldProps.scrollMargin)) {
      this.handleScrollMargins(nextProps.scrollMargin)
    }

    if (nextProps.focus && !oldProps.focus) {
      this.editor.focus();
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.height !== this.props.height || prevProps.width !== this.props.width){
      this.editor.resize();
    }
  }

  handleScrollMargins(margins = [0, 0, 0, 0]) {
    this.editor.renderer.setScrollMargin(margins[0], margins[1], margins[2], margins[3])
  }

  componentWillUnmount() {
    this.editor.destroy();
    this.editor = null;
  }

  onChange = (event) => {
    if (this.props.onChange && !this.silent) {
      const value = this.editor.getValue();
      this.props.onChange(value, event);
    }
  }

  onSelectionChange = (event) => {
    if (this.props.onSelectionChange) {
      const value = this.editor.getSelection();
      this.props.onSelectionChange(value, event);
    }
  }
  onCursorChange = (event) => {
    if(this.props.onCursorChange) {
      const value = this.editor.getSelection();
      this.props.onCursorChange(value, event)
    }
  }
  onInput = (event) => {
    if (this.props.onInput) {
      this.props.onInput(event)
    }
  }
  onFocus = (event) => {
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  }

  onBlur = (event) => {
    if (this.props.onBlur) {
      this.props.onBlur(event,this.editor);
    }
  }

  onCopy = (text) => {
    if (this.props.onCopy) {
      this.props.onCopy(text);
    }
  }

  onPaste = (text) => {
    if (this.props.onPaste) {
      this.props.onPaste(text);
    }
  }

  onScroll = () => {
    if (this.props.onScroll) {
      this.props.onScroll(this.editor);
    }
  }

  handleOptions = (props) => {
    const setOptions = Object.keys(props.setOptions);
    for (let y = 0; y < setOptions.length; y++) {
      this.editor.setOption(setOptions[y], props.setOptions[setOptions[y]]);
    }
  }

  handleMarkers(markers) {
    // remove foreground markers
    let currentMarkers = this.editor.getSession().getMarkers(true);
    for (const i in currentMarkers) {
      if (currentMarkers.hasOwnProperty(i)) {
        this.editor.getSession().removeMarker(currentMarkers[i].id);
      }
    }
    // remove background markers
    currentMarkers = this.editor.getSession().getMarkers(false);
    for (const i in currentMarkers) {
      if (currentMarkers.hasOwnProperty(i)) {
        this.editor.getSession().removeMarker(currentMarkers[i].id);
      }
    }
    // add new markers
    markers.forEach(({ startRow, startCol, endRow, endCol, className, type, inFront = false }) => {
      const range = new Range(startRow, startCol, endRow, endCol);
      this.editor.getSession().addMarker(range, className, type, inFront);
    });
  }

  updateRef = (item) => {
    this.refEditor = item;
  }

  render() {
    const { name, width, height, style } = this.props;
    const divStyle = { width, height, ...style };
    return (
      <div ref={this.updateRef}
        id={name}
        style={divStyle}
      >
      </div>
    );
  }
}
