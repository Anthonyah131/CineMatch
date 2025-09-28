/**
 * CineMatch - Firebase Test Screen
 * 
 * @format
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

function App(): JSX.Element {
  const [firebaseStatus, setFirebaseStatus] = useState<string>('No probado');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const testFirestore = async () => {
    setIsLoading(true);
    setFirebaseStatus('Probando conexión...');

    try {
      // Crear un documento de prueba
      const testDoc = {
        message: 'Hola CineMatch 🚀',
        timestamp: firestore.FieldValue.serverTimestamp(),
        platform: 'React Native',
      };

      // Escribir en Firestore
      await firestore()
        .collection('test')
        .doc('primerDoc')
        .set(testDoc);

      // Leer desde Firestore
      const doc = await firestore()
        .collection('test')
        .doc('primerDoc')
        .get();

      if (doc.exists) {
        const data = doc.data();
        setFirebaseStatus(`✅ Firebase funciona!\nMensaje: ${data?.message}`);
      } else {
        setFirebaseStatus('❌ Error: Documento no encontrado');
      }
    } catch (error: any) {
      console.error('Error de Firebase:', error);
      setFirebaseStatus(`❌ Error: ${error.message || 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={styles.backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.backgroundStyle}>
        <View style={styles.container}>
          <Text style={styles.title}>🎬 CineMatch Firebase Test</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Estado de Firebase:</Text>
            <Text style={styles.status}>{firebaseStatus}</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              isLoading && styles.buttonDisabled
            ]}
            onPress={testFirestore}
            disabled={isLoading}>
            <Text style={styles.buttonText}>
              {isLoading ? 'Probando...' : 'Probar Firestore'}
            </Text>
          </TouchableOpacity>

          <View style={styles.info}>
            <Text style={styles.infoTitle}>📋 Información del Proyecto:</Text>
            <Text style={styles.infoText}>• Package: com.cinematch</Text>
            <Text style={styles.infoText}>• Firebase: React Native Firebase</Text>
            <Text style={styles.infoText}>• Servicios: Auth, Firestore, Storage</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  container: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 32,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  status: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  info: {
    backgroundColor: '#e8f4f8',
    padding: 20,
    borderRadius: 12,
    width: '100%',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
});

export default App;
