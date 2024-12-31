import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import WebView from 'react-native-webview';
import { User, Search, LogOut } from 'lucide-react';

type RootStackParamList = {
  Auth: undefined;
  MainApp: undefined;
};

type TabParamList = {
  Search: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const LoginScreen = ({ navigation }: any) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showWebView, setShowWebView] = useState(false);
  const [loading, setLoading] = useState(false);

  // Create HTML form for submission
  const getLoginHtml = (userId: string, password: string) => `
    <html>
      <body>
        <form id="loginForm" action="http://search.lib.ou.ac.lk/cgi-bin/koha/opac-user.pl" method="post">
          <input type="hidden" name="koha_login_context" value="opac">
          <input type="hidden" name="userid" value="${userId}">
          <input type="hidden" name="password" value="${password}">
        </form>
        <script>
          document.getElementById('loginForm').submit();
        </script>
      </body>
    </html>
  `;

  const handleLogin = () => {
    if (userId && password) {
      setLoading(true);
      setShowWebView(true);
    }
  };

  const handleWebViewNavigationStateChange = (newNavState: any) => {
    const url = newNavState.url;
    
    // Check if login was successful
    if (url.includes('/opac-user.pl') && !url.includes('?failed=1')) {
      setLoading(false);
      setShowWebView(false);
      navigation.replace('MainApp');
    } 
    // Check if login failed
    else if (url.includes('?failed=1')) {
      setLoading(false);
      setShowWebView(false);
      // Here you could add error handling, like showing an alert
    }
  };

  if (showWebView) {
    return (
      <View style={styles.container}>
        <WebView
          source={{ html: getLoginHtml(userId, password) }}
          onNavigationStateChange={handleWebViewNavigationStateChange}
          style={{ flex: 1, display: 'none' }} // Hide WebView during authentication
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          incognito={true}
        />
        {loading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Logging in...</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>OU Library</Text>
        <View style={styles.inputContainer}>
          <User color="#64748b" size={20} />
          <TextInput
            style={styles.input}
            placeholder="Login ID"
            value={userId}
            onChangeText={setUserId}
            autoCapitalize="none"
            autoComplete="username"
          />
        </View>
        <View style={styles.inputContainer}>
          <LogOut color="#64748b" size={20} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />
        </View>
        <TouchableOpacity 
          style={[styles.loginButton, !userId || !password ? styles.loginButtonDisabled : null]}
          onPress={handleLogin}
          disabled={!userId || !password}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Add these new styles to your existing StyleSheet
const additionalStyles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
  loginButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
});

// Library Search Screen Component
const LibrarySearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showWebView, setShowWebView] = useState(false);

  const BASE_URL = 'https://search.lib.ou.ac.lk/cgi-bin/koha/opac-search.pl';
  
  const getSearchUrl = (query: string) => {
    return `${BASE_URL}?idx=&q=${encodeURIComponent(query)}&weight_search=1`;
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setShowWebView(true);
    }
  };

  const handleBack = () => {
    setShowWebView(false);
    setSearchQuery('');
  };

  if (showWebView) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search Results</Text>
        </View>
        <WebView
          source={{ uri: getSearchUrl(searchQuery) }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Library Search</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for books, journals..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={!searchQuery.trim()}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Profile Screen Component
const ProfileScreen = ({ navigation }: any) => {
  const handleLogout = () => {
    navigation.replace('Auth');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <User size={40} color="#3b82f6" />
          </View>
          <Text style={styles.profileName}>John Doe</Text>
          <Text style={styles.profileEmail}>john.doe@ou.ac.lk</Text>
        </View>

        <View style={styles.profileStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Books Borrowed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Due Soon</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={20} color="#ef4444" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Tab Navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Search') {
            return <Search size={size} color={color} />;
          } else {
            return <User size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#94a3b8',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Search" component={LibrarySearchScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Main App Component
const App = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={LoginScreen} />
      <Stack.Screen name="MainApp" component={TabNavigator} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 48,
    color: '#3b82f6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1e293b',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  loginButton: {
    backgroundColor: '#3b82f6',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    gap: 16,
  },
  searchInput: {
    height: 56,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  searchButton: {
    height: 56,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  webview: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#64748b',
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#fee2e2',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  logoutButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
  ...additionalStyles
});

export default App;
