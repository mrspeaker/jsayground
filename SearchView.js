var React = require('react-native');
var Editor = require('./Editor');

var {
    StyleSheet,
    View,
    Text,
    AsyncStorage,
    Component,
    ListView,
    TouchableHighlight,
    NavigatorIOS,
    AlertIOS
   } = React;

var styles = StyleSheet.create({
  description: {
    fontSize: 20,
    backgroundColor: 'white'
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
   },
   button: {
    fontFamily: 'Menlo',
    fontSize: 20,
    padding: 10,
    backgroundColor: '#000',
    color: '#fff'
  },
  container: {
      flex: 1,
      flexDirection: 'row',
      height: 30,
  },
  listView: {
       backgroundColor: '#F5FCFF'
   }
});

var STORAGE_KEY = require('./storage');

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      doBreak: false
    };
  }

  componentDidMount() {
    this.load();
  }

  load () {
    AsyncStorage.getItem(STORAGE_KEY).then(value => {
      if (value == null) {
        value = [{title: 'test', html:'<style></style>\n<div>hey!</div>\n<script></script>'}];
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      } else {
        value = JSON.parse(value);
      }

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(value)
      });
    });
  }

  onBreakFlip () {
    this.setState({doBreak: !this.state.doBreak});
  }

  componentWillReceiveProps () {
    this.load();
  }

  onAdd () {
    AlertIOS.prompt('hey', '', (title) => {
      if (title) {
        AsyncStorage.getItem(STORAGE_KEY).then(v => {
          var val = JSON.parse(v);
          var doc = {
            title: title,
            html: '<div>!</div>'
          }
          val.push(doc);
          AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(val))
            .then(() => {
              this.showDetail(doc);
            });
        });
      }
    });
  }

  showDetail (doc) {
    this.props.navigator.push({
      title: doc.title,
      component: Editor,
      passProps: {doc, emergencyBreak: this.state.doBreak},
    });
  }

  render() {
    return (
      <View style={{flex:1}}  automaticallyAdjustContentInsets={true}>
        <Text>.</Text>
        <View style={{flexDirection:'row'}}>
        <TouchableHighlight onPress={this.onAdd.bind(this)} >
          <Text style={styles.button}>Add</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.onBreakFlip.bind(this)} >
          <Text style={styles.button}>{this.state.doBreak ? 'break' : 'normal'}</Text>
        </TouchableHighlight>
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderDoc.bind(this)}
          style={styles.listView}
        />
      </View>
    ); //
  }

  renderDoc (doc) {
    return (
    <TouchableHighlight onPress={() => this.showDetail(doc)}>
      <View>
        <View style={styles.container}>
        <View style={styles.rightContainer}>
          <Text style={styles.title}>{doc.title}</Text>
        </View>
      </View>
        <View style={styles.separator} />
      </View>
    </TouchableHighlight>
     );
   }
}

module.exports = Search;
