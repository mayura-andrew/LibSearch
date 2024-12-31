
// ProfileScreen.tsx
import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import WebView from 'react-native-webview';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'https://search.lib.ou.ac.lk/cgi-bin/koha/opac-user.pl' }} // Direct URL to the profile page
        style={styles.webView}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
        )}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
