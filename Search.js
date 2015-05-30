'use strict';

var React = require('react-native');
var SearchView = require('./SearchView');
var Editor = require('./Editor');

var {
  StyleSheet,
  NavigatorIOS,
  Component,
  AlertIOS,
  AsyncStorage
  } = React;

var STORAGE_KEY = require('./storage');

var styles = StyleSheet.create({
  container: {
  flex: 1
  }
});

class Search extends Component {

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
              this.refs.nav.push({
                passProps: {doc},
                component: Editor
              });
            });
        });
      }
    });
  }

  render() {
    return (
      <NavigatorIOS
        navigationBarHidden={true}
        style={styles.container}
        ref="nav"
        initialRoute={{
          title: 'Docs',
          component: SearchView,
          rightButtonTitle: 'Add',
          onRightButtonPress: this.onAdd.bind(this)
        }}/>
    );
  }
}

module.exports = Search;
