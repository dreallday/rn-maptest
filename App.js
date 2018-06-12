/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  View
} from 'react-native';

import firebase from "react-native-firebase";
import MapView, { Marker } from 'react-native-maps';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const fetchURL = "https://serene-scrubland-62943.herokuapp.com/api/places";

type Props = {};
export default class App extends Component<Props> {

  constructor(props) {
    super(props);
    this.map = null;
    this.state = {
      limit: 100,
      data: [],
      count: 0
    }
  }
  componentDidMount = () => {
    // firebase begin test
    firebase.auth()
      .signInAnonymouslyAndRetrieveData()
      .then(credential => {
        if (credential) {
          console.log('default app user ->', credential.user.toJSON());
        }
      });

    firebase.messaging().hasPermission()
      .then(enabled => {
        if(enabled) {
          console.log("has permissions")
        } else {
          // user doesn't have permission
          console.log("does not has permissions")
          firebase.messaging().requestPermission()
            .then(() => {
              // User has authorised  
              console.log("user authorized permissions")
            })
            .catch(error => {
              // User has rejected permissions  
              console.log("user has rejected permissions")
            });
        }
      });

      // firebase end test

      fetch(`${fetchURL}?limit=${this.state.limit}`)
        .then(response => response.json())
        .then(data => {
          console.log("data", data);
          this.setState(data);
        });
  }

  renderData = () => {
    const { data, count } = this.state;

    if(!count || count <= 0) return <View/>
    let markers = [];
    data.map(marker => {
      markers.push(
        <Marker
          key={marker.id}
          title={marker.title}
          description={marker.description}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude
          }}
        />
      )
    });
    return markers
  }

  fitToMap = () => {
    let fit = [];
    this.state.data.map(marker => {
      fit.push({
        latitude: marker.latitude,
        longitude: marker.longitude
      });
    });
    this.map.fitToCoordinates(fit);
  }

  render() {
    return (
      <View style={[styles.container, StyleSheet.absoluteFillObject]}>
        <MapView
          ref={map => { this.map = map }}
          style={[StyleSheet.absoluteFill]}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          // onMapReady={() => { console.log("map ready")}}
          // onLayout={() => { console.log("on layout ready")}}
          
        >
        {this.renderData()}
        </MapView>
        <TouchableOpacity
          onPress={this.fitToMap}
          style={{ top: 25, left: 100, right: 100, borderRadius: 50, position: "absolute", width: "50%", height: 25, alignContent: "center", justifyContent: "center"}}>
          <View style={{justifyContent: "center", alignSelf: "center", alignContent: "center"}}>
            <Text>Center on Items</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
