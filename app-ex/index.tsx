import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Modal,
  Animated,
  RefreshControl,
  PanResponder,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const searchOptions = [
  { value: 'title', label: 'Book Title', icon: 'book' },
  { value: 'author', label: 'Author Name', icon: 'user' },
  { value: 'isbn', label: 'ISBN', icon: 'hash' },
  { value: 'subject', label: 'Subject', icon: 'grid' },
  { value: 'publisher', label: 'Publisher', icon: 'briefcase' }
];

const services = [
  { id: 'journals', title: 'E-Journals', icon: 'book', color: '#4f46e5' },
  { id: 'databases', title: 'E-Databases', icon: 'database', color: '#0891b2' },
  { id: 'papers', title: 'Past Papers', icon: 'file-text', color: '#be185d' },
  { id: 'repository', title: 'Repository', icon: 'archive', color: '#ca8a04' },
  { id: 'regional', title: 'Regional', icon: 'map-pin', color: '#15803d' },
  { id: 'info', title: 'Info Center', icon: 'info', color: '#9333ea' }
];

const filters = ['All', 'Books', 'Journals', 'Articles', 'Magazines'];

export default function LibraryService() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchType, setSearchType] = useState('title');
  const [showSearchTypeModal, setShowSearchTypeModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Animation values
  const searchModalY = useRef(new Animated.Value(height)).current;
  const serviceScaleValues = useRef(services.map(() => new Animated.Value(1))).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const tabBarSlide = useRef(new Animated.Value(0)).current;
  const searchBarWidth = useRef(new Animated.Value(width - 32)).current;
  const filterScrollY = useRef(new Animated.Value(0)).current;

  const theme = {
    bg: isDarkMode ? '#0f172a' : '#f8fafc',
    card: isDarkMode ? '#1e293b' : '#ffffff',
    text: isDarkMode ? '#f1f5f9' : '#0f172a',
    subtext: isDarkMode ? '#94a3b8' : '#64748b',
    border: isDarkMode ? '#334155' : '#e2e8f0',
    primary: '#3b82f6',
    accent: '#8b5cf6'
  };

  // Gesture Handler for Modal
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          searchModalY.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 100) {
          closeSearchModal();
        } else {
          Animated.spring(searchModalY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Animation Functions
  const openSearchModal = () => {
    setShowSearchTypeModal(true);
    Animated.spring(searchModalY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11
    }).start();
  };

  const closeSearchModal = () => {
    Animated.timing(searchModalY, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowSearchTypeModal(false));
  };

  const animateServicePress = (index) => {
    Animated.sequence([
      Animated.spring(serviceScaleValues[index], {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 100,
        friction: 5
      }),
      Animated.spring(serviceScaleValues[index], {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 5
      })
    ]).start();
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Animated.timing(fadeAnim, {
      toValue: 0.3,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      setRefreshing(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 2000);
  }, []);

  const SearchTypeModal = () => (
    <Modal
      visible={showSearchTypeModal}
      transparent={true}
      animationType="none"
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ translateY: searchModalY }],
              backgroundColor: theme.card
            }
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.modalHandle} />
          <Text style={[styles.modalTitle, { color: theme.text }]}>Select Search Type</Text>
          {searchOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[styles.modalOption, { borderBottomColor: theme.border }]}
              onPress={() => {
                setSearchType(option.value);
                closeSearchModal();
              }}
            >
              <View style={styles.modalOptionContent}>
                <Icon name={option.icon} size={20} color={theme.primary} />
                <Text style={[styles.modalOptionText, { color: theme.text }]}>
                  {option.label}
                </Text>
              </View>
              {searchType === option.value && (
                <Icon name="check" size={20} color={theme.primary} />
              )}
            </TouchableOpacity>
          ))}
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Library</Text>
        <TouchableOpacity 
          onPress={() => setIsDarkMode(!isDarkMode)}
          style={styles.themeToggle}
        >
          <LinearGradient
            colors={isDarkMode ? ['#f59e0b', '#d97706'] : ['#312e81', '#1e3a8a']}
            style={styles.themeToggleGradient}
          >
            <Animated.View
              style={{
                transform: [{
                  rotate: isDarkMode ? '0deg' : '180deg'
                }]
              }}
            >
              <Icon name={isDarkMode ? 'sun' : 'moon'} size={20} color="#ffffff" />
            </Animated.View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
          />
        }
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.searchContainer}>
            <TouchableOpacity
              style={[styles.searchBar, { backgroundColor: theme.card }]}
              onPress={openSearchModal}
            >
              <Icon name="search" size={20} color={theme.subtext} />
              <Text style={[styles.searchPlaceholder, { color: theme.subtext }]}>
                Search by {searchOptions.find(opt => opt.value === searchType)?.label.toLowerCase()}
              </Text>
            </TouchableOpacity>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.filterScroll}
            >
              {filters.map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterChip,
                    { 
                      backgroundColor: selectedFilter === filter.toLowerCase() 
                        ? theme.primary 
                        : theme.card,
                      borderColor: theme.border
                    }
                  ]}
                  onPress={() => setSelectedFilter(filter.toLowerCase())}
                >
                  <Text style={[
                    styles.filterText,
                    { color: selectedFilter === filter.toLowerCase() ? '#ffffff' : theme.text }
                  ]}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.servicesGrid}>
            {services.map((service, index) => (
              <Animated.View
                key={service.id}
                style={[
                  styles.serviceCard,
                  {
                    backgroundColor: theme.card,
                    transform: [{ scale: serviceScaleValues[index] }]
                  }
                ]}
              >
                <TouchableOpacity
                  onPress={() => animateServicePress(index)}
                  style={styles.serviceCardContent}
                >
                  <LinearGradient
                    colors={[service.color, `${service.color}dd`]}
                    style={styles.serviceIconContainer}
                  >
                    <Icon name={service.icon} size={24} color="#ffffff" />
                  </LinearGradient>
                  <Text style={[styles.serviceTitle, { color: theme.text }]}>
                    {service.title}
                  </Text>
                  <Text style={[styles.serviceDescription, { color: theme.subtext }]}>
                    Access collection
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      <SearchTypeModal />
    </SafeAreaView>
  );
}

// Import statements and component code remain exactly the same until the styles...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  themeToggle: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  themeToggleGradient: {
    padding: 10,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchPlaceholder: {
    marginLeft: 12,
    fontSize: 16,
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  filterText: {
    fontWeight: '500',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingTop: 8,
  },
  serviceCard: {
    width: (width - 48) / 2,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  serviceCardContent: {
    padding: 16,
    alignItems: 'center',
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  serviceDescription: {
    fontSize: 14,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingTop: 12,
    minHeight: height * 0.4,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#cbd5e1',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: Platform.OS === 'android' ? 12 : 0, // Fallback for Android which might not support gap
  },
  scrollView: {
    flex: 1,
  },
});
