'use strict';

var React = require('react-native');
var Editor = require('./Editor');
var Search = require('./Search');

var {
    AppRegistry,
    TabBarIOS,
    Component
   } = React;

class Jsayground extends Component {

  constructor (props) {

  }

  render () {
    return (
      /*
    <TabBarIOS selectedTab={this.state.selectedTab}>
        <TabBarIOS.Item
            selected={this.state.selectedTab === 'editor'}
            icon={{uri:'featured'}}
            onPress={() => {
                this.setState({
                    selectedTab: 'editor'
                });
            }}>
            <Editor />
        </TabBarIOS.Item>
        <TabBarIOS.Item
            selected={this.state.selectedTab === 'search'}
            icon={{uri:'search'}}
            onPress={() => {
                this.setState({
                    selectedTab: 'search'
                });
            }}>
            <Search />
        </TabBarIOS.Item>
    </TabBarIOS>*/
      <Search />
    )
  }

};

AppRegistry.registerComponent('jsayground', () => Jsayground);
