import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { AuthProvider, useAuth } from './context/AuthContext';
import { NetworkProvider } from './context/NetworkContext';
import { NotificationProvider } from './context/NotificationContext';
import { colors } from './constants/theme';
import { ROLES } from './data/mockData';

// Auth screens
import WelcomeScreen from './screens/auth/WelcomeScreen';
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen';

// Patient screens
import PatientHomeScreen from './screens/patient/PatientHomeScreen';
import PatientAIAssistantScreen from './screens/patient/PatientAIAssistantScreen';
import PatientHealthRecordsScreen from './screens/patient/PatientHealthRecordsScreen';
import PatientMedicationsScreen from './screens/patient/PatientMedicationsScreen';
import PatientProfileScreen from './screens/patient/PatientProfileScreen';
import SymptomCheckerScreen from './screens/patient/SymptomCheckerScreen';

// Doctor screens
import DoctorDashboardScreen from './screens/doctor/DoctorDashboardScreen';
import DoctorPatientsScreen from './screens/doctor/DoctorPatientsScreen';
import DoctorPatientDetailScreen from './screens/doctor/DoctorPatientDetailScreen';
import DoctorAppointmentsScreen from './screens/doctor/DoctorAppointmentsScreen';
import DoctorClinicalAssessmentScreen from './screens/doctor/DoctorClinicalAssessmentScreen';
import DoctorProfileScreen from './screens/doctor/DoctorProfileScreen';

// Admin screens
import AdminDashboardScreen from './screens/admin/AdminDashboardScreen';
import AdminUsersScreen from './screens/admin/AdminUsersScreen';
import AdminReportsScreen from './screens/admin/AdminReportsScreen';
import AdminSettingsScreen from './screens/admin/AdminSettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

function PatientTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { paddingBottom: 6, height: 62 },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home-outline';
          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'AI Assistant') iconName = 'chatbubble-ellipses-outline';
          else if (route.name === 'Health Records') iconName = 'document-text-outline';
          else if (route.name === 'Medications') iconName = 'medkit-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={PatientHomeScreen} />
      <Tab.Screen name="AI Assistant" component={PatientAIAssistantScreen} />
      <Tab.Screen name="Health Records" component={PatientHealthRecordsScreen} />
      <Tab.Screen name="Medications" component={PatientMedicationsScreen} />
      <Tab.Screen name="Profile" component={PatientProfileScreen} />
    </Tab.Navigator>
  );
}

function PatientStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PatientTabs" component={PatientTabs} />
      <Stack.Screen name="SymptomChecker" component={SymptomCheckerScreen} />
    </Stack.Navigator>
  );
}

function DoctorTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { paddingBottom: 6, height: 62 },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'grid-outline';
          if (route.name === 'DoctorHome') iconName = 'grid-outline';
          else if (route.name === 'DoctorPatients') iconName = 'people-outline';
          else if (route.name === 'DoctorAppointments') iconName = 'calendar-outline';
          else if (route.name === 'DoctorProfile') iconName = 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="DoctorHome" component={DoctorDashboardScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="DoctorPatients" component={DoctorPatientsScreen} options={{ title: 'Patients' }} />
      <Tab.Screen name="DoctorAppointments" component={DoctorAppointmentsScreen} options={{ title: 'Appointments' }} />
      <Tab.Screen name="DoctorProfile" component={DoctorProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

function DoctorStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DoctorTabs" component={DoctorTabs} />
      <Stack.Screen name="DoctorPatientDetail" component={DoctorPatientDetailScreen} />
      <Stack.Screen name="ClinicalAssessment" component={DoctorClinicalAssessmentScreen} />
    </Stack.Navigator>
  );
}

function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { paddingBottom: 6, height: 62 },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'speedometer-outline';
          if (route.name === 'AdminHome') iconName = 'speedometer-outline';
          else if (route.name === 'AdminUsers') iconName = 'people-outline';
          else if (route.name === 'AdminReports') iconName = 'bar-chart-outline';
          else if (route.name === 'AdminSettings') iconName = 'settings-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="AdminHome" component={AdminDashboardScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="AdminUsers" component={AdminUsersScreen} options={{ title: 'Users' }} />
      <Tab.Screen name="AdminReports" component={AdminReportsScreen} options={{ title: 'Reports' }} />
      <Tab.Screen name="AdminSettings" component={AdminSettingsScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return <AuthStack />;
  }

  if (user.role === ROLES.DOCTOR) return <DoctorStack />;
  if (user.role === ROLES.ADMIN) return <AdminTabs />;
  return <PatientStack />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NetworkProvider>
        <AuthProvider>
          <NotificationProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </NotificationProvider>
        </AuthProvider>
      </NetworkProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
});