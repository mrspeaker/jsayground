'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  AsyncStorage,
  Text,
  TextInput,
  ScrollView,
  View,
  WebView,
  TouchableHighlight
} = React;

var STORAGE_KEY = require('./storage');
var docText = '';
var domPage = `
<style>
  *{
    margin:0;
    padding:0;
  }
  canvas{
    position:absolute;
    transform:translateZ(0);
  }
</style>
<canvas></canvas>
<script>
  var canvas = document.querySelector('canvas');
  var ctx = canvas.getContext('2d');

  function loop (t) {
    ctx.fillStyle = 'hsl(' + (t / 10 % 360 | 0) + ', 50%, 50%)';
    ctx.fillRect(0, 0, 300, 300);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
</script>
`;

var Editor = React.createClass({

  getInitialState() {
    return {
      title: "none",
      html: "<div>nope</div>"
    };
  },

  componentDidMount() {
    this.setState({
      title: this.props.doc.title
    });

    AsyncStorage.getItem(STORAGE_KEY)
      .then(docs => {
        var doc = JSON.parse(docs).filter(d => d.title === this.props.doc.title)[0];
        docText = doc.html;
        if (this.props.emergencyBreak) {
          docText = "<!--" + docText;
        }
        this.setState({
          html: docText
        });
      })

  },

  onRun () {
    this.setState({html: docText});
  },

  onDelete () {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(docs => {
        var leftDocs = JSON.parse(docs).filter(h => h.title !== this.state.title);
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(leftDocs))
          .then(() => this.props.navigator.pop());
      });
  },

  onSave () {
    this.setState({html: docText});
    AsyncStorage.getItem(STORAGE_KEY)
      .then(value => {
        var newValue = JSON.parse(value).map(h => {
          if (h.title === this.state.title) {
            h.html = docText;
          }
          return h;
        });
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newValue));
      });
  },

  onBack () { this.props.navigator.pop() },

  onCanv() {
    docText = require('./libTemplate');
    this.onRun();
  },

  onValueChange (html) {
    docText = html;
  },

  render: function() {

    return (
      <View style={styles.container}>
        <View style={{flex:1}}>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', backgroundColor:'#048'}}>
          <TouchableHighlight onPress={this.onRun} >
            <Text style={styles.button}>Run</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.onSave} >
            <Text style={styles.button}>Save</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.onDelete} >
            <Text style={styles.button}>Delete</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.onCanv} >
            <Text style={styles.button}>Canv</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.onBack} >
            <Text style={styles.button}>Back</Text>
          </TouchableHighlight>
          </View>
          <WebView
          automaticallyAdjustContentInsets={true}
          html={this.state.html}
          style={styles.wv}
          ></WebView>
        </View>
        <ScrollView style={{backgroundColor: '#222', flex:1, flexDirection:'column'}} automaticallyAdjustContentInsets={true}>
          <TextInput
            multiline={true}
            autoCorrect={false}
            value={docText}
            style={{
              padding: 5,
              backgroundColor: '#000',
              color: '#fff',
              height: 500,
              fontSize:11, fontFamily:'Menlo',
              }}
            onChangeText={this.onValueChange}
             />
        </ScrollView>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5FCFF'
  },
  wv: {

  },
  t: {
    fontFamily: 'Menlo',
    fontSize: 20,
    paddingRight: 20
  },
  button: {
    fontFamily: 'Menlo',
    fontSize: 20,
    padding: 10,
    backgroundColor: '#000',
    color: '#fff'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

module.exports = Editor;
