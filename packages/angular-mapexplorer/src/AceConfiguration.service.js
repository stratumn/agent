export default class AceConfigurationService {
  configure(editor) {
    editor.setShowPrintMargin(false);
    editor.$blockScrolling = Infinity;
    editor.setOptions({
      fontFamily: 'RationalTWText-Light, \'Roboto Mono\', monospace',
      fontSize: '14'
    });
  }
}
